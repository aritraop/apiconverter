window.addEventListener('DOMContentLoaded', () => {
  const key = localStorage.getItem('auth-key')
  if (!key || key !== 'validated') {
    return window.location.replace('/welcome')
  }
  console.log('validated')
})
function prettyPrint() {
  console.log('here')
  var ugly = document.querySelector('.drop-box').value;
  try {
    var obj = JSON.parse(ugly);
  } catch (error) {
    alert('invalid json')
    return
  }
  var pretty = JSON.stringify(obj, undefined, 2);
  document.querySelector('.drop-box').value = pretty;
}
async function handleSubmit() {
  document.querySelector('.loader').style.display = "block"
  var ugly = document.querySelector('.drop-box').value;
  const response = await fetch('/convert', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ data: ugly })
  })
  const json = await response.json()
  if (json.message) {
    document.querySelector('.loader').style.display = "none"
    return alert(`${json.message} due to ${json.error.split('15')}...`)
  }
  const something = YAML.stringify(json)
  document.querySelector('.loader').style.display = "none"
  document.querySelector('.pick-box').value = something;
}