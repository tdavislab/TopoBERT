# TODOs

## Server
- [ ] Implement `get_graph()` (only called when data is not already present)
    * [ ] Parse arguments and generate file (make parent directories if required)
    * [ ] Use PCA for node positions and store the positions to be used by front-end
- [ ] 2d mapper
- [ ] PCA/TSNE/UMAP views, split view, highlight selected nodes
- [ ] Arbitrary parameters


## Preprocess
- [x] Add PCA based node positions
- [x] Add 25% and 75% overlap parameters
- [ ] PCA from last step

    
## UI
- [x] Remove extra layer buttons
- [x] Split parameter selection into Distance - Filter - Intervals - Overlap
- [x] Add run button
- [x] Clear selected rows and stats on new iteration selection
- [x] Dismiss current selection by clicking anywhere on SVG
- [x] Switch between force/PCA
- [x] Highlight node on click
- [x] Filter by Jaccard
- [x] Filter by label
- [x] Search by word
- [ ] Dropdown to choose color of node - filter func  vs label
- [x] Color by majority / Pie chart / Hover glyph to see island and branches
- [ ] Color by label on TSNE/UMAP projection
- [x] Parameter selection for majority criterion based on purity on nodes, change 50% filter criteria
- [ ] Suggested hierarchies using node purity/bifurcation measure
- [ ] Filter - Centrality based measure, average knn_5 /  vs absolute knn_5 / L1 
- [ ] Color scheme to preserve hierarchy - top level, then darken/lighten for child nodes
- [ ] About page / tutorial page to explain the functionality and math behind it
- [x] Probing with TopoAct -> TopoBERT

- [x] Color mapper nodes by label, hierarchical color scheme
- [x] Other filter functions, eccentricity, average knn distance 5, L1

- [ ] Slider for overlap
- [ ] Slider for threshold, return all nodes containing atleast 1 member, plus percentage thresholding
- [x] Rainbow, bin into 46 bins
- [ ] Fix word-label table height (auto instead of hard-coded) 
- [ ] Alignment between mapper and actual data, replace node with collection of circles, 
  moving circles between nodes to show movement
- [ ] Tracking graph view
- [ ] Enable arbritrary parameter for mapper

- [x] 'Other' category + top-k (k=7) 
- [x] Toggle nodesize 
- [x] Assign colors to specific labels
- [ ] Splitting by words
- [ ] Ball mapper - choice of filter function
- [ ] TSNE / UMAP projection of each time-step

-------------------------
- [ ] Show distribution of word frequency on node click
- [ ] Can we use geometry of BERT to help refine ontology and vice versa
- [ ] Attraction to previous (t-1) node's position added to force-layout optimization task
- [ ] No hard-coded
- [ ] Remove sent-id, word-id, l2-norm columns from Table
- [ ] Graph qualty metric - combination of purity + neighbor + diversity 
  sameness (makes more sense at t=0, best quality at initial stage would mean 
  better filter function), show metric at each  time-step
- [ ] Select chain by clicking on edge


- [ ] Visualize the dynamics of the test set using mapper graph
- [ ] Visualize training set first using mapper graph, and then superimpose the test set onto the training
    - knn with k = 1, and assign the test point to the cluster of the nearest ngbr in training data
    - knn with k >= 1, collect all vertices in train set with nearest ngbr and assign edges to each with 
      weight proportional to normalized number of neighbors in the train vertex, number of outgoing edges
      also take care of points where labels of test and training ngbr do not match
- [ ] Distribution of histograms of purities instead of global trend
- [ ] Visualize the dispersion of test set over the mapper graph (assign test point to a node in 
  the train set mapper graph, break ties arbitrarily), also keep in mind the neighbor labels,
  as time goes on the node it is assigned to should have similar labels
- [ ] How does TopoBert help understand the retraining process? And if it can help in the retraining process
- [ ] Can topobert be used to create a summary of the process of prediction - generate diagnostic reports
    that explain why a particular node - topology doctor / diagnosis
  