document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('auth-key') === 'validated') { return window.location.replace('/convert') }
  const value = prompt('how did you choose programing as a carrier?')
  if (value === 'by mistake') {
    localStorage.setItem('auth-key', 'validated')
    window.location.replace('/convert')
  } else {
    window.location.replace('/welcome')
  }
})