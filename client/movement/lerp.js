

// Will interpolate
function buffer() {
    let arrays = Object.values(arguments);
    movementQueue = [];

    for(i = 0; i < arrays.length; i++) {
        movementQueue = movementQueue.concat(arrays[i]);
    }

    if (!movementQueue.length) return null

    // frames per second the game operates on
    var FPS = game.loop.actualFps;
    // seconds between 
    var secondsSinceLastUpdate = serverDeltaTime/1000;
    // how smooth we want it to be :)
    var framesToBuffer = FPS * secondsSinceLastUpdate;
    
    var interpolatedQueue = []; 

    // for every movement stack
    for(i = 0; i < movementQueue.length; i++) {
        var nextFrame = movementQueue[i + 1];
        if(!nextFrame) break;
        var currentFrame = movementQueue[i];
        interpolatedQueue.push(currentFrame);
        var frameDelta = {
            x: nextFrame.x - currentFrame.x,
            y: nextFrame.y - currentFrame.y
        };
        
        for(let j = 1; j < framesToBuffer; j++) {
            let offset = j/framesToBuffer;
            
            interpolatedQueue.push({
                x: currentFrame.x + (offset * frameDelta.x),
                y: currentFrame.y + (offset * frameDelta.y),

                // to be able to change animations on each update
                direction: nextFrame.direction,
                moving: nextFrame.moving,
            });
        }
    }

    // *** END FRAME ***
    interpolatedQueue.push(movementQueue.slice(-1)[0]);

    return interpolatedQueue;
}


/*


keep the last movement section around
so you have to find the "seam" in your interpolation sequence

lerp(lastQueue, data.movementQueue)
lastQueue = data.movementQueue;
-----------|---------|---------------|
start       received  received        received
[A] =[B,C]> [D] =[E]> [F] =[G, H, I]> [J]

received
[A]
    if !user.lastQueue.length 
        user.lastQueue = data.movementQueue
received
[C]
    else
        user.movementQueue = lerp(user.lastQueue, data.movementQueue)
        user.lastQueue = data.movementQueue
[E]
    else
        user.movementQueue = lerp(user.lastQueue, data.movementQueue)
        user.lastQueue = data.movementQueue
Say you start at: A
And the next packet you get is D
You interpolate
Then the next packet you get is F, and the following one J
The trick is to keep D around and interpolate that one to F, too.
so you have to keep the tail around to patch it with the next packet.
*/