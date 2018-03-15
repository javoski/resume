const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const Handlebars = require('handlebars')
const ora = require('ora')

const dataFile = './data.yml'
const tplFile = './template.html'
const assetsPath = 'assets'
const distPath = './dist'
const distFileName = 'index.html'

const spinner = ora('Reading data').start()

function setState (msg, state) {
  spinner.text = msg
  switch (state) {
    case 'success':
      spinner.succeed()
      break
    case 'error':
      spinner.fail()
      break
  }
}

async function build () {
  try {
    const [data, tpl] = await Promise.all([
      fs.readFile(dataFile, 'utf8'),
      fs.readFile(tplFile, 'utf8')
    ])
    setState('Building resume')
    const renderFn = Handlebars.compile(tpl)
    const resumeData = yaml.safeLoad(data)
    await fs.ensureDir(distPath)
    const result = renderFn(resumeData)
    await fs.writeFile(path.resolve(distPath, distFileName), result, 'utf8')
    await fs.copy(assetsPath, path.resolve(distPath, assetsPath))
    setState('Successfully built', 'success')
  } catch (e) {
    setState(e.message, 'error')
  }
}

build()