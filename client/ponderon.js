window.onload = function () {
  var input = d3.select('textarea#console')
  var output = d3.select('div#output')
  input.style('background-color', '#c0c0c0')
  input.node().focus()
  input.on('keyup', (e = d3.event) => {
    if (e.keyCode == 13) {
      if (!e.shiftKey) {
        process(input.property('value'), output)
        input.property('value', '')
      }
    }
  })
}

function process(text, output) {
  var result =  eval(text)
  output.append("div").attr('class', 'bubble').text(text)
  output.append("div").attr('class', 'bubble output').text(result)
}