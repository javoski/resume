const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const Handlebars = require('handlebars')

// Promisify error-first async function
// const promisify = fn => function () {
//   const args = [].slice.call(arguments)
//   return new Promise ((resolve, reject) => {
//     args.push(function (err, result) {
//       if (err) reject(err)
//       else resolve(result)
//     })
//     fn.apply(this, args)
//   })
// }

// Promisify fs.readFile & fs.writeFile
// const readFile = promisify(fs.readFile)
// const writeFile = promisify(fs.writeFile)
// const mkdir = promisify(fs.mkdir)

const dataFile = './data.yml'
const tplFile = './template.html'
const assetsPath = 'assets'
const distPath = './dist'
const distFileName = 'index.html'

async function build () {
  try {
    const [data, tpl] = await Promise.all([
      fs.readFile(dataFile, 'utf8'),
      fs.readFile(tplFile, 'utf8')
    ])
    const renderFn = Handlebars.compile(tpl)
    const resumeData = yaml.safeLoad(data)
    await fs.ensureDir(distPath)
    const result = renderFn(resumeData)
    await fs.writeFile(path.resolve(distPath, distFileName), result, 'utf8')
    await fs.copy(assetsPath, path.resolve(distPath, assetsPath))
  } catch (e) {
    throw e
  }
}

build()