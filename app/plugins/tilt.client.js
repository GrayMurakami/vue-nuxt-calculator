export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('tilt', {
    mounted(el) {
      const update = e => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 20;
        const y = ((e.clientY - r.top ) / r.height - 0.5) * -20;
        el.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
      }
      el.__tiltIn  = e => update(e);
      el.__tiltOut = () => (el.style.transform = '');
      el.addEventListener('mousemove', el.__tiltIn);
      el.addEventListener('mouseleave', el.__tiltOut);
    },
    unmounted(el) {
      el.removeEventListener('mousemove', el.__tiltIn);
      el.removeEventListener('mouseleave', el.__tiltOut);
    }
  })
})