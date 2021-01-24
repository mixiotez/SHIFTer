# SHIFTer

SHIFTer is an HTML5 / CSS / Vanilla JavaScript platform videogame inspired by Time Fcuk

You can play it here ➡️ https://mikempala.github.io/SHIFTer/

## Instructions

Use the arrow keys and the space bar to navigate to the exit. Some levels require a key to unlock the door.

Most levels have two layers: lighter-colored tiles are 'walkable' in the current layer, while darker colored tiles are walkable in the second layer.

You can switch between layers using "A" and "D".

## Sounds

All the sounds were created by me using FL Studio and YMCK's Magical 8bit Plug.

## What approach was taken when creating this?

1. Player and moving logic were coded.
2. The game layout was created via a matrix. A method was created to inspect the matrix and return a tile-based on its value.
3. A collision checker was added to the matrix: this allowed players to stay on platforms and exit levels.
4. Levels became more complex, and more items were added, such as keys and saws.
5. The main menu was created, followed by the tutorial (based on images).
6. Sounds and timer were included as well as a final screen when the game was won.
7. The code was refactored several times with readability and performance improvements.
8. The main menu was re-imagined: the hamburger menu disappeared, animations were added, and the tutorial was integrated into the game.
9. Warnings were added on two breakpoints to signal the lack of mobile support.
10. The "congratulations" screen and timer were improved.
11. A footer was added as well as a muting button that disables all sounds.
