// Used to chain sprite animations together
// with tween timelines

function EventChain() {
  this.chain = []
  this.timeline = null
  this.cb = function() {}
}
EventChain.prototype.setTimeline = function(timeline) {
  if (timeline) this.timeline = timeline

  return this
}
EventChain.prototype.onDone = function(cb) {
  if (typeof cb == 'function') {
    this.cb = cb
  }

  return this
}
EventChain.prototype.wait = function(n) {
  this.chain.push(n);
  return this
}
EventChain.prototype.then = function(f) {
  this.chain.push(f);
  return this
}
EventChain.prototype.play = function(i = 0) {
  var self = this;

  if (self.timeline) {
    self.timeline.play()
    self.timeline = false
  }

  var event = self.chain[i];
  var nextEvent = self.chain[i + 1]

  if (typeof event == 'number') {
    setTimeout(function() {
      if (nextEvent) {
        self.play(i+1)
      } else {
        self.end();
      }
    }, event);
  } else if (typeof event == 'function') {
    event();

    if (nextEvent) {
      self.play(i+1)
    } else {
      self.end();
    }
  } else {
    throw Error('unknown event at ', i)
  }

  return this
}
EventChain.prototype.end = function() {
  this.cb();
  this.chain = [];
}