/**
 * Binary Search Tree (BST) for Movie Search
 * Supports insert, search by name/id, and in-order traversal.
 */

class BSTNode {
  constructor(movie) {
    this.movie = movie;         // Full movie object
    this.left = null;
    this.right = null;
  }
}

export class MovieBST {
  constructor() {
    this.root = null;
  }

  // Insert a movie into the BST (keyed by movieName lowercase)
  insert(movie) {
    const node = new BSTNode(movie);
    if (!this.root) {
      this.root = node;
      return;
    }
    this._insertNode(this.root, node);
  }

  _insertNode(current, node) {
    const key = node.movie.movieName.toLowerCase();
    const curKey = current.movie.movieName.toLowerCase();
    if (key < curKey) {
      if (!current.left) current.left = node;
      else this._insertNode(current.left, node);
    } else {
      if (!current.right) current.right = node;
      else this._insertNode(current.right, node);
    }
  }

  // Search movies whose name OR id contains the query string
  search(query) {
    if (!query || query.trim() === '') return this.inOrder();
    const q = query.toLowerCase().trim();
    const results = [];
    this._searchNode(this.root, q, results);
    return results;
  }

  _searchNode(node, query, results) {
    if (!node) return;
    const name = node.movie.movieName.toLowerCase();
    const id = String(node.movie.movieId).toLowerCase();
    if (name.includes(query) || id.includes(query)) {
      results.push(node.movie);
    }
    this._searchNode(node.left, query, results);
    this._searchNode(node.right, query, results);
  }

  // In-order traversal — returns all movies sorted by name
  inOrder() {
    const results = [];
    this._inOrder(this.root, results);
    return results;
  }

  _inOrder(node, results) {
    if (!node) return;
    this._inOrder(node.left, results);
    results.push(node.movie);
    this._inOrder(node.right, results);
  }

  // Build BST from an array of movies
  static fromArray(movies) {
    const bst = new MovieBST();
    movies.forEach(m => bst.insert(m));
    return bst;
  }
}
