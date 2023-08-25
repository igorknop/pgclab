import Graph from './Graph.js';

describe('Graph', () => {
  let graph;

  beforeEach(() => {
    graph = new Graph();
  });

  test('should have the following methods', () => {
    expect(typeof graph.addVertex).toBe('function');
    expect(typeof graph.addEdge).toBe('function');
    expect(typeof graph.removeEdge).toBe('function');
    expect(typeof graph.removeVertex).toBe('function');
  });

  test('should add vertex to the graph', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    expect(graph.adjacencyList).toEqual({
      A: [],
      B: [],
      C: [],
    });
  });

  test('should add edge between two vertices', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'C');
    expect(graph.adjacencyList).toEqual({
      A: ['B', 'C'],
      B: ['A', 'C'],
      C: ['A', 'B'],
    });
  });

  test('should remove edge between two vertices', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'C');
    graph.removeEdge('A', 'C');
    expect(graph.adjacencyList).toEqual({
      A: ['B'],
      B: ['A', 'C'],
      C: ['B'],
    });
  });

  test('should remove vertex from the graph', () => {
    graph.addVertex('A');
    graph.addVertex('B');
    graph.addVertex('C');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'C');
    graph.removeVertex('B');
    expect(graph.adjacencyList).toEqual({
      A: ['C'],
      C: ['A'],
    });
  });
});