#! /usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const pk = require('../package.json')
program
.version(pk.version)
.command('create [name]')
.description('创建项目')
// -f or --force 为强制创建，如果创建的目录存在则直接覆盖
.option('-f, --force', 'overwrite target directory if it exist')
.action((name, options) => { 
  // 打印命令行输入的值
	require('../lib/create.js')(name, options);
})
program
   // 配置版本号信息
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')
  // 监听 --help 执行
  .on('--help', () => {
    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan(`zz <command> --help`)} for detailed usage of given command\r\n`)
  })
  
// 解析用户执行命令传入参数
program.parse(process.argv);