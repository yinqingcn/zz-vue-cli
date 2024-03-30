const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')
const repoUrl = 'github:yinqingcn/vue3-ep-template#master'

module.exports = async function (name, options) {
  let createProjectName = name
  // 执行创建命令
  if (!createProjectName) {
    // 命名项目
    const { projectName } = await inquirer.prompt({
        type: "input",
        name: "projectName",
        message: "请输入项目名称：",
        default: "my-product-vue3",
    })
    createProjectName = projectName
  }
  // 当前命令行选择的目录
  const cwd  = process.cwd();
  // 需要创建的目录地址
  const targetAir  = path.join(cwd, createProjectName)
  console.log("项目路径:  " + chalk.cyan(targetAir))
  // 目录是否已经存在？
  if (fs.existsSync(targetAir)) {
    // 是否为强制创建？
    if (options.force) {
      await fs.remove(targetAir)
    } else {
      // 询问用户是否确定要覆盖
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: '该目录已存在，请选择操作:',
          choices: [
            {
              name: '强制覆盖',
              value: 'overwrite'
            },{
              name: '取消',
              value: false
            }
          ]
        }
      ])
      if (!action) {
        return;
      } else if (action === 'overwrite') {
        // 移除已存在的目录
        await fs.remove(targetAir)
      }
    }
  }
  const message = '正在初始化...'
  // 初始化
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();
  // Values: 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray'
  spinner.color = 'cyan';    

  // 获取模板信息
  download(repoUrl, targetAir, err => {
    if (err) {
      spinner.fail('初始化项目失败，请重试或执行一下命令'); // 
      console.log(`git clone ${chalk.cyan('https://github.com/yinqingcn/vue3-ep-template.git')}`)
    } else {
      spinner.stop() // 停止
      console.log(`项目创建成功`)
      console.log('执行以下命令开始使用:\n')
      console.log(' cd %s', createProjectName)
      console.log(` ${chalk.blue('pnpm install')}`)
      console.log(` ${chalk.blue('pnpm run dev')} \n`)
    }
  })
}