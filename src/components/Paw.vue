<template>
  <div ref="paw" @click="onClick" style="position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: -1">
    <i id="bubbleradius"></i>
    <span class="paw" v-for="(c, index) in circles" :style="style(c)" :key="c.key"
          :class="{ popped: c.popped }">&nbsp;</span>
  </div>
</template>

<script>
import {reactive, toRefs} from "vue";
import {onMounted} from "vue";

export default {
  name: "Paw",
  setup() {
    const rotate = (x, y, sin, cos, reverse) => {
      return reverse ? {
        x: cos * x + sin * y,
        y: cos * y - sin * x
      } : {
        x: cos * x - sin * y,
        y: cos * y + sin * x
      }
    }
    const flatten = arr => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
    const self = reactive({
      globalId: null,
      paw: null,
      style: (c) => {
        return `top:${c.y}px;left:${c.x}px;box-shadow:0 0 2rem hsl(${c.hue}, 75%, 50%) inset`
      },
      update: (tm) => {
        if (!self.moving) {
          return
        }
        if (self.lastExec && self.circles.length) {
          let diff = (tm - self.lastExec)
          // let huediff = (self.hue + diff/30) % 360
          let box = self.paw.getBoundingClientRect()
          let radius = self.paw.querySelector('#bubbleradius').getBoundingClientRect().width

          let couples = []
          self.circles.filter(cc => !cc.popped).forEach(c1 => {
            self.circles.filter(cc => !cc.popped).forEach(c2 => {
              if (c1 !== c2) {
                couples.push([c1, c2])
              }
            })
          })

          let collisions = couples.filter(couple => {
            let dist = Math.sqrt(Math.pow(couple[0].y - couple[1].y, 2) +
                Math.pow(couple[0].x - couple[1].x, 2))
            return dist < radius * 2
          })

          let newcollisions = collisions.filter(couple => {
            let key = couple[0].key + couple[1].key
            return self.lastCollisions.indexOf(key) < 0
          })

          newcollisions.forEach(couple => {
            let a = couple[0]
            let b = couple[1]

            if (a.collisionFree && b.collisionFree) {
              if (false) {
                a.new_vx = (a.vx * (a.mass - b.mass) + (2 * b.mass * b.vx)) / (a.mass + b.mass)
                a.new_vy = (a.vy * (a.mass - b.mass) + (2 * b.mass * b.vy)) / (a.mass + b.mass)
              } else {
                let dx = b.x - a.x
                let dy = b.y - a.y
                let collisionAngle = Math.atan2(dy, dx)
                let sin = Math.sin(collisionAngle)
                let cos = Math.cos(collisionAngle)
                let pos_a = {x: 0, y: 0}
                let pos_b = rotate(dx, dy, sin, cos, true)
                let vel_a = rotate(a.vx, a.vy, sin, cos, true)
                let vel_b = rotate(b.vx, b.vy, sin, cos, true)
                let vxTotal = vel_a.x - vel_b.x
                vel_a.x = ((a.mass - b.mass) * vel_a.x + 2 * b.mass * vel_b.x) / (a.mass + b.mass)
                vel_b.x = vxTotal + vel_a.x
                pos_a.x += vel_a.x
                pos_b.x += vel_b.x

                let pos_a_final = rotate(pos_a.x, pos_a.y, sin, cos, false)
                let vel_a_final = rotate(vel_a.x, vel_a.y, sin, cos, false)
                a.new_x = a.x + pos_a_final.x
                a.new_y = a.y + pos_a_final.y;
                a.new_vx = vel_a_final.x;
                a.new_vy = vel_a_final.y;

                // each collision shows up in array twice: a->b and b->a
                let pos_b_final = rotate(pos_b.x, pos_b.y, sin, cos, false)
                let vel_b_final = rotate(vel_b.x, vel_b.y, sin, cos, false)
                b.x = a.x + pos_b_final.x
                b.y = a.y + pos_b_final.y
                b.new_vx = vel_b_final.x;
                b.new_vy = vel_b_final.y;
              }
            }
          })

          newcollisions.forEach(couple => {
            let a = couple[0]
            let b = couple[1]
            if (a.new_vy) {
              a.vx = a.new_vx
              a.vy = a.new_vy
              a.x = a.new_x
              a.y = a.new_y
              a.hue += 20
            }
          })

          self.lastCollisions = collisions.map(couple => {
            return couple[0].key + couple[1].key
          })

          let collided = [...new Set(flatten(newcollisions))]
          let collidedKeys = collided.map(c => c.key)


          self.circles.forEach(c => {
            c.collisionFree = c.collisionFree || (collidedKeys.indexOf(c.key) < 0)
            if (c.y < 0) {
              c.vy = Math.abs(c.vy)
            } else if (c.y > box.height) {
              c.vy = -Math.abs(c.vy)
            }
            if (c.x < 0) {
              c.vx = Math.abs(c.vx)
            } else if (c.x > box.width) {
              c.vx = -Math.abs(c.vx)
            }

            c.y += c.vy * diff
            c.x += c.vx * diff
          })
        }
        self.lastExec = tm
        self.globalId = requestAnimationFrame(self.update)
      },
      handleVisibilityChange: () => {
        if (!document[self.hiddenProperty]) {
          self.globalId = requestAnimationFrame(self.update)
          self.moving = true
        } else {
          cancelAnimationFrame(self.globalId)
          self.moving = false
        }
      },
      onClick: (evt) => {
        let m = {
          x: evt.pageX,
          y: evt.pageY
        }
        let nearest = null
        let nearest_distsq = Infinity
        let dx, dy, distsq
        let radius = self.paw.querySelector('#bubbleradius').getBoundingClientRect().width
        self.circles.forEach(c => {
          dx = m.x - c.x
          dy = m.y - c.y
          distsq = dx * dx + dy * dy
          if (distsq < nearest_distsq && distsq < c.radius * c.radius) {
            nearest = c
            nearest_distsq = distsq
          }
        })
        if (nearest) {
          // let idx = self.circles.indexOf(nearest)
          // self.circles.splice(idx, 1)
          nearest.popped = true
        }
      },
      init:()=>{
        let box = self.paw.getBoundingClientRect()
        let radius = self.paw.querySelector('#bubbleradius').getBoundingClientRect().width
        let max = (box.width * box.height) / 600 / Math.pow(radius, 1.2)
        for (let i = 0; i < max; i++) {

          self.circles.push({
            key: Math.random(),
            y: Math.random() * box.height,
            x: Math.random() * box.width,
            vx: Math.random() / 5,
            vy: Math.random() / 5,
            hue: Math.random() * 360,
            collisionFree: false,
            mass: 1,
            radius: radius,
            popped: false
          });
        }
        self.globalID = requestAnimationFrame(self.update)

        let hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
          hidden = "hidden";
          visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
          hidden = "msHidden";
          visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
          hidden = "webkitHidden";
          visibilityChange = "webkitvisibilitychange";
        }
        self.hiddenProperty = hidden
        self.visibilityChangeEvent = visibilityChange
        document.addEventListener(self.visibilityChangeEvent, self.handleVisibilityChange, false)
      },
      circles: [],
      lastExec: null,
      hue: 250,
      lastCollisions: [],
      hiddenProperty: null,
      visibilityChangeEvent: null,
      moving: true
    })
    onMounted(() => {
      // self.init()
      window.init = self.init
    })
    return {
      ...toRefs(self)
    }
  }
}
</script>

<style  lang="scss" scoped>
#bubbleradius {
  width: 4.5rem;
  height: 1px;
  opacity: 0;
  z-index: -1;
  display: block;
}

.paw {
  transform: translate(-50%, -50%);
  border-radius: 9rem;
  height: 9rem;
  width: 9rem;
  display: block;
  position: absolute;
  opacity: 1;
  transition: box-shadow .5s ease-in-out, transform .07s ease-out, opacity .04s ease-in;
}

.paw.popped {
  transform: translate(-50%, -50%) scale(2);
  opacity: 0;
}

.paw:after {
  content: '';
  position: absolute;
  top: 18%;
  left: 18%;
  background-color: rgba(191, 255, 255, 0.6);
  width: 0.6rem;
  height: 1.5rem;
  border-radius: 50%;
  transform: rotate(45deg) scale(0.8);
}

</style>
