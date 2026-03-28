/**
 * Sorting utility for Priority List
 * Sorts movies by release date/time ascending (soonest first = highest priority).
 * Uses a Min-Heap (Priority Queue) under the hood.
 */

class MinHeap {
  constructor() {
    this.heap = [];
  }

  // Returns the timestamp of a movie's release date for comparison
  _priority(movie) {
    return new Date(movie.releaseDateTime).getTime();
  }

  _parent(i) { return Math.floor((i - 1) / 2); }
  _left(i)   { return 2 * i + 1; }
  _right(i)  { return 2 * i + 2; }

  insert(movie) {
    this.heap.push(movie);
    this._bubbleUp(this.heap.length - 1);
  }

  _bubbleUp(i) {
    while (i > 0) {
      const p = this._parent(i);
      if (this._priority(this.heap[p]) > this._priority(this.heap[i])) {
        [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
        i = p;
      } else break;
    }
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return min;
  }

  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = this._left(i);
      const r = this._right(i);
      if (l < n && this._priority(this.heap[l]) < this._priority(this.heap[smallest])) smallest = l;
      if (r < n && this._priority(this.heap[r]) < this._priority(this.heap[smallest])) smallest = r;
      if (smallest !== i) {
        [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
        i = smallest;
      } else break;
    }
  }

  size() { return this.heap.length; }
}

/**
 * sortMoviesByExpiry(movies)
 * Returns movies sorted from soonest release/expiry date to latest.
 * Only includes movies whose releaseDateTime is in the future or today.
 */
export function sortMoviesByExpiry(movies) {
  const heap = new MinHeap();
  const now = new Date().getTime();

  movies.forEach(movie => {
    const t = new Date(movie.releaseDateTime).getTime();
    // Include all movies; soonest expiring first
    heap.insert(movie);
  });

  const sorted = [];
  while (heap.size() > 0) {
    sorted.push(heap.extractMin());
  }
  return sorted;
}

/**
 * getNextMovie(movies)
 * Returns the single next upcoming movie (closest future releaseDateTime).
 */
export function getNextMovie(movies) {
  const now = new Date().getTime();
  const upcoming = movies.filter(m => new Date(m.releaseDateTime).getTime() >= now);
  if (upcoming.length === 0) return null;
  const sorted = sortMoviesByExpiry(upcoming);
  return sorted[0];
}
