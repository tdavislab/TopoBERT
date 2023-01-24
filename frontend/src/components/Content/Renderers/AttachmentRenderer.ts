import * as d3 from 'd3';
import { store } from '../../../store/store';
import { Attachment } from '../../../store/types';

export default class AttachmentRenderer {
  attachment_g: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  sources!: d3.Selection<d3.BaseType | SVGGElement, string, d3.BaseType, unknown>;
  targets!: d3.Selection<d3.BaseType | SVGRectElement, string, d3.BaseType, unknown>;

  constructor() {
    this.attachment_g = d3.select('#attachment-svg-g');
  }

  draw(attachmentData: Attachment) {
    this.attachment_g = d3.select('#attachment-svg-g');

    this.attachment_g.selectAll('*').remove();

    const sources = Object.keys(store.state.colorMap);
    const targets = Object.keys(store.state.colorMap);

    console.log(sources);
    console.log(this.attachment_g);

    this.sources = this.attachment_g.selectAll('.sources').data(sources).join('g').attr('class', 'sources');

    this.sources
      .append('line')
      .attr('x1', 150 + 7.5)
      .attr('y1', (d, i) => i * 20 + 20)
      .attr('x2', 350)
      .attr('y2', (d, i) => findTarget(d) * 20 + 20)
      .attr('stroke', (d, i) => (findTarget(d) === -1 ? 'none' : 'black'))
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 5);

    this.sources
      .append('rect')
      .attr('x', 150)
      .attr('y', (d, i) => i * 20 + 10)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d) => store.state.colorMap[d].color);

    this.sources
      .append('text')
      .text((d) => d)
      .attr('x', 140)
      .attr('y', (d, i) => i * 20 + 22)
      .attr('text-anchor', 'end')
      .attr('font-size', '14px');

    this.targets = this.attachment_g.selectAll('.targets').data(targets).join('g').attr('class', 'targets');

    this.targets
      .append('rect')
      .attr('x', 350)
      .attr('y', (d, i) => i * 20 + 10)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d) => store.state.colorMap[d].color);

    function findTarget(source: string) {
      const tentativeTargets = attachmentData[source];
      if (source === 'Others' || Object.keys(tentativeTargets).length === 0) {
        return -1;
      } else {
        const target = Object.keys(tentativeTargets).reduce((a, b) => (tentativeTargets[a] > tentativeTargets[b] ? a : b));
        return targets.indexOf(target);
      }
    }
  }
}
