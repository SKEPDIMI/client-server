// Used to chain sprite animations together
// with tween timelines

function EventChain() {
  var state = {
    chain: [],
    timeline: null,
    cb: function() {}
  }

  state.setTimeline = function(timeline) {
    if (timeline) state.timeline = timeline
  
    return state
  }
  state.onDone = function(cb) {
    if (typeof cb == 'function') {
      state.cb = cb
    }

    return state
  }
  state.wait = function(n) {
    if (typeof n == 'number') {
      state.chain.push(n);
    }

    return state
  }
  state.then = function(f) {
    if (typeof f == 'function') {
      state.chain.push(f);
    }

    return state
  }
  state.play = function(i = 0) {
    if (state.timeline) {
      state.timeline.play()
      state.timeline = false
    }
  
    var event = state.chain[i];
    var nextEvent = state.chain[i + 1]
  
    if (typeof event == 'number') {
      setTimeout(function() {
        if (nextEvent) {
          state.play(i+1)
        } else {
          state.end();
        }
      }, event);
    } else if (typeof event == 'function') {
      event();
  
      if (nextEvent) {
        state.play(i+1)
      } else {
        state.end();
      }
    } else {
      throw Error('unknown event at ', i)
    }
  
    return state
  }
  state.end = function() {
    state.cb();
    state.chain = [];
  }

  return Object.assign(
    {},
    state
  )
}
