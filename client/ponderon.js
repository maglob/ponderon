window.onload = function () {
  var input = d3.select('textarea#console')
  var output = d3.select('div#output')
  var error = d3.select('div#error')
  input.style('background-color', '#c0c0c0')
  input.node().focus()
  input.on('keyup', (e = d3.event) => {
    if (e.keyCode == 13) {
      if (!e.shiftKey) {
        process(input, output, error)
      }
    }
  })
}

function process(input, output, error) {
  try {
    var text = input.property('value')
    var result = eval(text)
    output.append("div").attr('class', 'bubble').text(text)
    output.append("div").attr('class', 'bubble output').text(result)
    error.style('visibility', 'hidden')
    input.property('value', '')
  } catch (e) {
    error.style('visibility', 'visible').text(e)
  }
}