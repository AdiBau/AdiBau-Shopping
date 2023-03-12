function errorSend(massage) {
  const mass = {
    ...massage,
    time: new Date().toUTCString(),
  }
  //const url = 'https://biuro.adibau.pl/birthday/error'
  const url = 'http://192.168.1.123:8080/birthday/error'
  console.log(mass)

  fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(mass),
  })
}

export default errorSend
