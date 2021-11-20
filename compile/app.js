var token = []
var tokens = []
const start = (char) => {
  if (
    char === '1' ||
    char === '2' ||
    char === '3' ||
    char === '4' ||
    char === '5' ||
    char === '6' ||
    char === '7' ||
    char === '8' ||
    char === '9' ||
    char === '0'
  ) {
    token.push(char)
    return inNumber
  }
  if (char === '+' || char === '-' || char === '*' || char === '/') {
    emitToken(char, char)
    return start
  }
  if (char === ' ') {
    return start
  }
  if (char === '\r' || char === '\n') {
    return start
  }
  if (char === Symbol.for('EOF')) {
    emitToken('EOF')
  }
}

const inNumber = (char) => {
  if (
    char === '1' ||
    char === '2' ||
    char === '3' ||
    char === '4' ||
    char === '5' ||
    char === '6' ||
    char === '7' ||
    char === '8' ||
    char === '9' ||
    char === '0'
  ) {
    token.push(char)
    return inNumber
  } else {
    emitToken('Number', token.join(''))
    token = []
    return start(char)
  }
}

function emitToken(type, value) {
  console.log(value)
  tokens.push({
    type,
    value,
  })
}

var input = '1024 + 2 + 256 / 2'
var state = start
for (var c of input.split('')) {
  state = state(c)
}
state(Symbol.for('EOF'))

console.log(tokens)

function Expression(source) {
  if (
    source[0].type === 'AdditiveExpression' &&
    source[1] &&
    source[1].type === 'EOF'
  ) {
    let node = {
      type: 'Expression',
      children: [source.shift(), source.shift()],
    }
    source.unshift(node)
    return node
  }
  AdditiveExpression(source)
  return Expression(source)
}
function AdditiveExpression(source) {
  if (source[0].type === 'MultiplicativeExpression') {
    let node = {
      type: 'AdditiveExpression',
      children: [source[0]],
    }
    source[0] = node
    return AdditiveExpression(source)
  }
  if (
    source[0].type === 'AdditiveExpression' &&
    source[1] &&
    source[1].type === '+'
  ) {
    let node = {
      type: 'AdditiveExpression',
      operator: '+',
      children: [],
    }
    node.children.push(source.shift())
    node.children.push(source.shift())
    MultiplicativeExpression(source)
    node.children.push(source.shift())
    source.unshift(node)
    return AdditiveExpression(source)
  }
  if (
    source[0].type === 'AdditiveExpression' &&
    source[1] &&
    source[1].type === '-'
  ) {
    let node = {
      type: 'AdditiveExpression',
      operator: '-',
      children: [],
    }
    node.children.push(source.shift())
    node.children.push(source.shift())
    MultiplicativeExpression(source)
    node.children.push(source.shift())
    source.unshift(node)
    return AdditiveExpression(source)
  }
  if (source[0].type === 'AdditiveExpression') return source[0]
  MultiplicativeExpression(source)
  return AdditiveExpression(source)
}
function MultiplicativeExpression(source) {
  if (source[0].type === 'Number') {
    let node = {
      type: 'MultiplicativeExpression',
      children: [source[0]],
    }
    source[0] = node
    return MultiplicativeExpression(source)
  }
  if (
    source[0].type === 'MultiplicativeExpression' &&
    source[1] &&
    source[1].type === '*'
  ) {
    let node = {
      type: 'MultiplicativeExpression',
      operator: '*',
      children: [],
    }
    node.children.push(source.shift())
    node.children.push(source.shift())
    node.children.push(source.shift())
    source.unshift(node)
    return MultiplicativeExpression(source)
  }
  if (
    source[0].type === 'MultiplicativeExpression' &&
    source[1] &&
    source[1].type === '/'
  ) {
    let node = {
      type: 'MultiplicativeExpression',
      operator: '/',
      children: [],
    }
    node.children.push(source.shift())
    node.children.push(source.shift())
    node.children.push(source.shift())
    source.unshift(node)
    return MultiplicativeExpression(source)
  }
  if (source[0].type === 'MultiplicativeExpression') return source[0]

  return MultiplicativeExpression(source)
}

// var ast = Expression(tokens)

// console.log(ast)

function evaluate(node) {
  if (node.type === 'Expression') {
    return evaluate(node.children[0])
  }
  if (node.type === 'AdditiveExpression') {
    if (node.operator === '-') {
      return evaluate(node.children[0]) - evaluate(node.children[2])
    }
    if (node.operator === '+') {
      return evaluate(node.children[0]) + evaluate(node.children[2])
    }
    return evaluate(node.children[0])
  }
  if (node.type === 'MultiplicativeExpression') {
    if (node.operator === '*') {
      return evaluate(node.children[0]) * evaluate(node.children[2])
    }
    if (node.operator === '/') {
      return evaluate(node.children[0]) / evaluate(node.children[2])
    }
    return evaluate(node.children[0])
  }
  if (node.type === 'Number') {
    return Number(node.value)
  }
}

// console.log(evaluate(ast))
