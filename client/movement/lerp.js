

// Will interpolate
function buffer(movementQueue) {
    if (typeof movementQueue != 'object') return null

    // frames per second the game operates on
    const FPS = ~~(game.loop.actualFps);
    // seconds between 
    const secondsSinceLastUpdate = serverDeltaTime/1000;
    // how smooth we want it to be :)
    const framesToBuffer = FPS * secondsSinceLastUpdate;
    
    let interpolatedQueue = []; 

    // for every movement stack
    for(let i = 0; i < movementQueue.length; i++) {
        // { x: 3, y: 3 }
        let nextFrame = movementQueue[i + 1];
        if(!nextFrame) break;

        // { x: 1, y: 1 }
        let currentFrame = movementQueue[i];
        
        // *** START FRAME ***
        // [ { x: 1, y: 1 } ]
        interpolatedQueue.push(currentFrame);

        // { x: 2, y: 2 }
        let frameDelta = {
            x: nextFrame.x - currentFrame.x,
            y: nextFrame.y - currentFrame.y
        };
        
        // LERPing goes on here
        // *** EVERYTHING IN BETWEEN ***
        for(let j = 1; j < framesToBuffer; j++) {
            let offset = j/framesToBuffer;
            
            interpolatedQueue.push({
                x: currentFrame.x + (offset * frameDelta.x),
                y: currentFrame.y + (offset * frameDelta.y),
            });
        }
    }

    // *** END FRAME ***
    interpolatedQueue.push(movementQueue.slice(-1)[0]);

    return interpolatedQueue;
}
