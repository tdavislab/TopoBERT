import { RootState, NodeSize } from './types';
import { ActionContext } from 'vuex';

export const actions = {
  updateGraph(context: ActionContext<RootState, RootState>): void {
    console.table(context.state.mapperParams);
  },
  datasetUpdate(context: ActionContext<RootState, RootState>) {
    console.log(`Updating to ${context.state.datasetList.selected}`);
  },
  toggleNodeSize(context: ActionContext<RootState, RootState>, updatedNodeSize: NodeSize) {
    if (updatedNodeSize === context.state.nodeSize) return;
    context.commit('setNodeSize', updatedNodeSize);
  },
};
