const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const centerX = canvas.width / 2
const centerY = canvas.height / 2

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y

        this.radius = radius
        this.color = color
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this. velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.smoothRadius = radius
        this.color = color
        this. velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.smoothRadius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

const x = centerX
const y = centerY

const player = new Player(x, y, 20, 'white')
const projectiles = []
const enemies = []

function spawnEnemies() {
    setInterval(() => {
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`
        const radius = Math.random() * 20 + 10

        let x
        let y        

        if (Math.random() < 0.5) {
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
            x = Math.random() * canvas.width
        } else {
            y = Math.random() * canvas.height
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
        }

        const angle = Math.atan2(y - centerY,x - centerX)
        const velocity = {x: Math.cos(angle) * -2, y: Math.sin(angle) * -2}

        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

const projectile = new Projectile(
    centerX, 
    centerY, 
    5, 
    'white', 
    {
        x: 1,
        y: 1
    }
)

let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 10, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    projectiles.forEach((projectile, i) => {
        projectile.update()
        
        //remove from edges
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(i, 1)
            }, 0)
        }
        
    })
    player.draw()

    enemies.forEach((enemy, i) => {
        enemy.update()

        enemy.smoothRadius += (enemy.radius - enemy.smoothRadius) / 8

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        //you die
        if (dist < enemy.radius + player.radius) {
            cancelAnimationFrame(animationId)
        }

        projectiles.forEach((projectile, projectileindex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            
            if (dist < projectile.radius + enemy.radius) {
                setTimeout(() => {
                    projectiles.splice(projectileindex, 1)
                }, 0)

                if (enemy.radius > 15) {
                    enemy.radius -= 10
                } else {
                    setTimeout(() => {
                        enemies.splice(i, 1)
                    }, 0)
                }
            }
        })
    })
}

addEventListener('click', function (event) {

        const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX)
        const velocity = {x: Math.cos(angle) * 5, y: Math.sin(angle) * 5}

        projectiles.push(new Projectile(centerX + Math.cos(angle) * 12, centerY + Math.sin(angle) * 12, 5, 'white', velocity))
    })

animate()
spawnEnemies()