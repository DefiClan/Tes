const Web3 = require('web3')
const { spawn } = require('child_process')
const axios = require('axios')
const http = require('http')
const { Telegraf, session, Extra, Markup, Scenes} = require('telegraf');
//const { BaseScene, Stage } = Scenes
const mongo = require('mongodb').MongoClient;
//const { enter, leave } = Stage
//const stage = new Stage();
//const Coinbase = require('coinbase');
const express = require('express')
var bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
//const Scene = BaseScene
app.use(bodyParser.json());
const data = require('./data');
//const Client = require('coinbase').Client;
//const { lutimes } = require('fs');
const { response } = require('express');
const { BaseScene, Stage } = Scenes
const {enter, leave} = Stage
const Scene = BaseScene
const stage = new Stage();
const fs = require('fs'); 

const path = require('path'); 

   const fse = require('fs-extra');


const  bot = new Telegraf(data.bot_token)
mongo.connect(data.mongoLink, {useUnifiedTopology: true}, (err, client) => {
  if (err) {
    console.log(err)
  }

  db = client.db('ABot'+data.bot_token.split(':')[0])
  bot.telegram.deleteWebhook().then(success => {
  success && console.log('Bot Is Started')
})
})
bot.launch()

bot.use(session())
bot.use(stage.middleware())

const check = new Scene('check')
stage.register(check)

const getWallet= new Scene('getWallet')
stage.register(getWallet)

const ds = new Scene('ds')
stage.register(ds)

const getMsg = new Scene('getMsg')
stage.register(getMsg)

const onWithdraw = new Scene('onWithdraw')
stage.register(onWithdraw)

const ok2 = new Scene('ok2')
stage.register(ok2)

const ok = new Scene('ok')
stage.register(ok)

const fbhandle = new Scene('fbhandle')
stage.register(fbhandle)

const twiterhandle = new Scene('twiterhandle')
stage.register(twiterhandle)

const yt = new Scene('yt')
stage.register(yt)

const yt5 = new Scene('yt5')
stage.register(yt5)

const done = new Scene('done')
stage.register(done)

const t1 = new Scene('t1')
stage.register(t1)

const t2 = new Scene('t2')
stage.register(t2)

const cur = new Scene('cur')
stage.register(cur)

const rpc = new Scene('rpc')
stage.register(rpc)

const dis = new Scene('dis')
stage.register(dis)

const ban = new Scene('ban')
stage.register(ban)

const unban = new Scene('unban')
stage.register(unban)

const add = new Scene('add')
stage.register(add)

const from = new Scene('from')
stage.register(from)

const cont = new Scene('cont')
stage.register(cont)

const key = new Scene('key')
stage.register(key)

const minw = new Scene('minw')
stage.register(minw)

const maxw = new Scene('maxw')
stage.register(maxw)

const cch = new Scene('cch')
stage.register(cch)

const rcch = new Scene('rcch')
stage.register(rcch)

const sch = new Scene('sch')
stage.register(sch)

const rch = new Scene('rch')
stage.register(rch)

const refer = new Scene('refer')
stage.register(refer)
const pay = new Scene('pay')
stage.register(pay)

const admin = data.bot_admin

//var client = new Client({
   //apiKey: cb_api_key,
   //apiSecret: cb_api_secret ,strictSSL: false
//});
const botStart = async (ctx) => {
  try {

    if (ctx.message.chat.type != 'private') {
      return
    }
    let dbData = await db.collection('allUsers').find({ userId: ctx.from.id }).toArray()
    let bData = await db.collection('vUsers').find({ userId: ctx.from.id }).toArray()
let admin = await db.collection('admin').find({admin:'admin'}).toArray()
        if (!(admin.length)){
            let botData = {admin:'admin',ref:1,minw:2,maxw:4,cur:'Not Set',botstat:'Active',withstat:'Active',cpay:'no',channel:[],t1:'twitter.com',t2:'twitter.com',yt:'youtube.com',parse:'Not Set',contract:'NOT SET',addr:'NOT SET',channels:[]}
            db.collection('admin').insertOne(botData)
            ctx.replyWithMarkdown("*👀 Bot Data Saved In Database Try To Restart Bot /start*")
            return
        }
    if (bData.length === 0) {
      if (ctx.startPayload && ctx.startPayload != ctx.from.id) {
        let ref = ctx.startPayload * 1
        db.collection('pendUsers').insertOne({ userId: ctx.from.id, inviter: ref })
      } else {
        db.collection('pendUsers').insertOne({ userId: ctx.from.id })
      }

      db.collection('allUsers').insertOne({ userId: ctx.from.id, virgin: true, paid: false })
      db.collection('balance').insertOne({ userId: ctx.from.id, balance: 0})
      let emojis = ['🪂','🏈','🏏','🏆','🎮','🎯','🏖','🏥','⚰']
                let q1 = Math.floor(Math.random()*50)*1
                let q2 = Math.floor(Math.random()*50)*1
                let ans = q1+q2
                db.collection('captcha').updateOne({userId: ctx.from.id}, {$set: {value: ans}}, {upsert: true})
	ctx.replyWithMarkdown('*➡️Hi, before you start the bot, please prove you are human by answering the question below.*\nPlease answer: '+q1+' + '+q2+' =\n*Send your answer now*') 
ctx.scene.enter('check') 
    } else {
        let pData = await db.collection('pendUsers').find({ userId: ctx.from.id }).toArray()
        if (('inviter' in pData[0]) && !('referred' in dbData[0])) {
          let bal = await db.collection('balance').find({ userId: pData[0].inviter }).toArray()
          console.log(bal)
         
          
          var cal = bal[0].balance * 1
          var sen = admin[0].ref * 1
          var see = cal + sen
          bot.telegram.sendMessage(pData[0].inviter, '➕* New Referral on your link* you received ' + admin[0].ref + ' ' + admin[0].cur+'', { parse_mode: 'markdown' })
          db.collection('allUsers').updateOne({ userId: ctx.from.id }, { $set: { inviter: pData[0].inviter, referred: 'surenaa' } }, { upsert: true })
          db.collection('joinedUsers').insertOne({ userId: ctx.from.id, join: true })
          db.collection('balance').updateOne({ userId: pData[0].inviter }, { $set: { balance: see } }, { upsert: true })
sendJoined(ctx,admin)
        } else {
          db.collection('joinedUsers').insertOne({ userId: ctx.from.id, join: true })

          sendJoined(ctx,admin)
        }
    }
  } catch (e) {
    sendError(e, ctx)
  }
}

bot.start(botStart)
bot.hears(['⬅️ Back', '🔙 back'], botStart)
bot.on('message',async (ctx, next) => {
	if(ctx.message.chat.type=='private'){
			let admin = await db.collection('admin').find({admin:'admin'}).toArray()
	const bot = admin[0].botstat
	if(bot!='Active'){
		ctx.replyWithMarkdown('*Bot Is In Maintenance*') 
		return
		}
    // Assuming you have a 'banned' field in your database to indicate ban status
const userId = ctx.from.id;
    // Check if the user is in the 'banned' collection and banned status is true
    const isBanned = await db.collection('banned').findOne({ userId, ban: true });
    if (isBanned) {
        ctx.replyWithMarkdown('*You Are Banned By Admin.*');
    } else {
        // User is not banned, continue to the next middleware or command handler
        next();
    }
    }
}) 
check.on('text',async (ctx) =>{
    try{
    	let admin = await db.collection('admin').find({admin:'admin'}).toArray()
         var dd = await db.collection('captcha').find({ userId: ctx.from.id }).toArray()
 var right = dd[0].value
 console.log(right)
var ans = ctx.message.text
//var ans = an[0]
    let dbData = await db.collection('checkUsers').find({ userId: ctx.from.id }).toArray()
    let bData = await db.collection('pendUsers').find({ userId: ctx.from.id }).toArray()
    let dData = await db.collection('allUsers').find({ userId: ctx.from.id }).toArray()
console.log(ans)

    if (ctx.from.last_name) {
      valid = ctx.from.first_name + ' ' + ctx.from.last_name
    } else {
      valid = ctx.from.first_name
    }

    if(right==ans){
        db.collection('vUsers').insertOne({ userId: ctx.from.id, answer: ans, name: valid })
        ctx.scene.leave()
                
          let pData = await db.collection('pendUsers').find({ userId: ctx.from.id }).toArray()
          if (('inviter' in pData[0]) && !('referred' in dData[0])) {
            let bal = await db.collection('balance').find({ userId: pData[0].inviter }).toArray()
            
            
            var cal = bal[0].balance * 1
            var sen = admin[0].ref * 1
            var see = cal + sen
bot.telegram.sendMessage(pData[0].inviter, '➕ *New Referral on your link* you received ' + admin[0].ref + ' ' + admin[0].cur, { parse_mode: 'markdown' })
            db.collection('allUsers').updateOne({ userId: ctx.from.id }, { $set: { inviter: pData[0].inviter, referred: 'surenaa' } }, { upsert: true })
            db.collection('joinedUsers').insertOne({ userId: ctx.from.id, join: true })
            db.collection('balance').updateOne({ userId: pData[0].inviter }, { $set: { balance: see } }, { upsert: true })
          sendJoined(ctx,admin)

          } else {
            db.collection('joinedUsers').insertOne({ userId: ctx.from.id, join: true })

         sendJoined(ctx,admin)
          }
        
      } else {
        ctx.replyWithMarkdown(' _wrong_')
      }
  } catch (err) {
    sendError(err, ctx)
  }
})

bot.command('broadcast', (ctx) => {
if(ctx.from.id==admin){
ctx.scene.enter('getMsg')}
})

getMsg.enter((ctx) => {
  ctx.replyWithMarkdown(
    ' *Okay Admin 👮‍♂, Send your broadcast message*', 
    { reply_markup: { keyboard: [['⬅️ Back']], resize_keyboard: true } }
  )
})

getMsg.leave((ctx) => starter(ctx))

getMsg.hears('⬅️ Back', (ctx) => {ctx.scene.leave('getMsg')})

getMsg.on('text', (ctx) => {
ctx.scene.leave('getMsg')

let postMessage = ctx.message.text
if(postMessage.length>3000){
return ctx.reply('Type in the message you want to sent to your subscribers. It may not exceed 3000 characters.')
}else{
globalBroadCast(ctx,admin)
}
})

async function globalBroadCast(ctx,userId){
let perRound = 20000;
let totalBroadCast = 0;
let totalFail = 0;

let postMessage =ctx.message.text

let totalUsers = await db.collection('allUsers').find({}).toArray()

let noOfTotalUsers = totalUsers.length;
let lastUser = noOfTotalUsers - 1;

 for (let i = 0; i <= lastUser; i++) {
 setTimeout(function() {
      sendMessageToUser(userId, totalUsers[i].userId, postMessage, (i === lastUser), totalFail, totalUsers.length);
    }, (i * perRound));
  }
  return ctx.reply('Your message is queued and will be posted to all of your subscribers soon. Your total subscribers: '+noOfTotalUsers)
}

function sendMessageToUser(publisherId, subscriberId, message, last, totalFail, totalUser) {
  bot.telegram.sendMessage(subscriberId, message,{parse_mode:'html'}).catch((e) => {
if(e == 'Forbidden: bot was block by the user'){
totalFail++
}
})
let totalSent = totalUser - totalFail

  if (last) {
    bot.telegram.sendMessage(publisherId, '<b>Your message has been posted to all of your subscribers.</b>\n\n<b>Total User:</b> '+totalUser+'\n<b>Total Sent:</b> '+totalSent+'\n<b>Total Failed:</b> '+totalFail, {parse_mode:'html'});
  }
}
 

bot.hears('/Michael', async (ctx) => {
  try {
  if(ctx.message.chat.type != 'private'){
    return
    }
    
    let bData = await db.collection('vUsers').find({userId: ctx.from.id}).toArray()
   
  let dbData = await db.collection('vUsers').find({stat:"stat"}).toArray()
  let dData = await db.collection('vUsers').find({}).toArray()
  
  ctx.replyWithMarkdown(
  'Total Users: '+dData.length+'\nTotal Payout:- '+dbData.pay+'')
  
   } catch (err) {
      sendError(err, ctx)
    }
  })

bot.hears('💰 Balance',async (ctx) => {

let aData = await db.collection('allUsers').find({userId: ctx.from.id}).toArray()
let maindata = await db.collection('balance').find({ userId: ctx.from.id }).toArray()
let allRefs = await db.collection('allUsers').find({inviter: ctx.from.id}).toArray()
let thisUsersData = await db.collection('balance').find({userId: ctx.from.id}).toArray()
let sum
sum = thisUsersData[0].balance

let wallet = aData[0].coinmail
let twiter = maindata[0].twiter
let twit = aData[0].twitter
let admin = await db.collection('admin').find({admin:'admin'}).toArray()
ctx.replyWithMarkdown('*🙌🏻 User = '+ctx.from.first_name+'\n\n💰 Balance = '+sum.toFixed(3)+' '+admin[0].cur+'\n\n🪢 Invite To Earn More*')
})
bot.hears('📎 Referral Link', async ctx => {
	let allRefs = await db.collection('allUsers').find({inviter: ctx.from.id}).toArray()
		let admin = await db.collection('admin').find({admin:'admin'}).toArray()
	ctx.replyWithMarkdown('*🙌🏻 User = '+ctx.from.first_name+'\n\n🙌🏻 Your Invite Link =* `https://t.me/'+bot.botInfo.username+'?start='+ctx.from.id+'`\n\n*Total Invite --* `'+allRefs.length+'`\n\n*🎁 Refferal Reward:* `'+admin[0].ref+' '+admin[0].cur+'`\n*🛑 Minimum Redeem :* `'+admin[0].minw+' '+admin[0].cur+'`') 
	}) 
bot.hears('🟢 Joined', async ctx => {
        let admin = await db.collection('admin').find({admin:'admin'}).toArray()
  let checkJoined = await joinCheck(ctx.from.id,admin)
  if(checkJoined){
  	var kc = `*🔘 Follow us On* [Twitter](https://twitter.com/CryptoMasterCom) *like & retweet pinned post and tag 3 friends*

*Submit Your Twittwr Username Below*`
 ctx.replyWithMarkdown('*🔴 Mandatory Task for receiving Withdrawal*\n\n🔹 Follow [Twitter]('+admin[0].t1+') \n🔹 Follow Partner [Tweet]('+admin[0].t2+') \n🔹 Follow [YouTube]('+admin[0].yt+') \n\n\n*(Note: This is a compulsory task for receiving withdrawal)*\n\n_Click ✅  Check After doing the task_', { disable_web_page_preview: true, reply_markup: { keyboard:[['✅  Check']],resize_keyboard: true  } })
  } else {
    ctx.replyWithMarkdown('*Please join channel to go next*')
  }
})
bot.hears('✅  Check', async ctx => {
	let admin = await db.collection('admin').find({admin:'admin'}).toArray()
	ctx.replyWithMarkdown('🔘 Follow our [Twitter Page , Like And Retweet the Pinned Post]('+admin[0].t1+'). And also you must turn on Notification button, then tag 3 friends\n\n📄 Send Your Twitter Profile Link\n( Example : https://twitter.com/AirdropbyMich )', {disable_web_page_preview: true, reply_markup: { remove_keyboard: true  } })
	ctx.scene.enter('ok2')
}) 
ok2.on('text',async ctx => {
	let admin = await db.collection('admin').find({admin:'admin'}).toArray()
if(ctx.message.text.includes("https://twitter.com/")) {
ctx.scene.leave();
ctx.replyWithMarkdown('🔘 Follow our [Partner Page , Like And Retweet the Pinned Post]('+admin[0].t2+'). And also you must turn on Notification button, then tag 3 friends\n\n📄 Send Your Twitter Profile Link\n( Example : https://twitter.com/AirdropbyMich )') 
ctx.scene.enter('ok')
}else{
ctx.replyWithMarkdown('*Wrong Format*')
        }
})
ok.on('text', async (ctx) => {
	let admin = await db.collection('admin').find({admin:'admin'}).toArray()
	let msg = ctx.message.text
	if(ctx.message.text.includes("https://twitter.com/")) {
db.collection('allUsers').updateOne({userId: ctx.from.id}, {$set: {twitter: ctx.message.text}}, {upsert: true})
	ctx.scene.leave();
ctx.replyWithMarkdown('🔘 Follow our [YouTube page, Like and comment on the video]('+admin[0].yt+') you see there and turn on the Notification button. \n\n📄 Send Your YouTube Profile Link\n( Example : https://youtube.com/@AirdropbyMichael or send your Gmail you used to sign up YouTube )', { disable_web_page_preview: true, reply_markup: { remove_keyboard:true}})
ctx.scene.enter('ds')
}else{
	ctx.replyWithMarkdown('*Wrong Format*') 
	}
})
yt.on('text', async ctx => {
	let admin = await db.collection('admin').find({admin:'admin'}).toArray()
	if(ctx.message.text.includes("https://youtube.com/") || ctx.message.text.includes("@gmail.com")) {
		db.collection('allUsers').updateOne({userId: ctx.from.id}, {$set: {yt: ctx.message.text}}, {upsert: true})
		ctx.scene.leave();
		ctx.replyWithMarkdown('*🔘 Join our* [Discord community]('+admin[0].dis+') *and say you are from Airdrop by Michael. Then submit your Discord username, If you don\'t do this main task you won\'t get Airdrop be warned. Send your username in this format {Williamsthedon}*') 
		ctx.scene.enter('ds') 
		}else{
			ctx.replyWithMarkdown('*Wrong Format*') 
			}
			}) 
ds.on('text', async (ctx) => {
	let admin = await db.collection('admin').find({admin:'admin'}).toArray()
	ctx.scene.leave();
ctx.replyWithMarkdown('*Submit Your '+admin[0].cur+' Address*') 
ctx.scene.enter('twiterhandle')
})

twiterhandle.on('text', async (ctx) => {
try {
let admin = await db.collection('admin').find({admin:'admin'}).toArray()

let msg = ctx.message.text
db.collection('allUsers').updateOne({userId: ctx.from.id}, {$set: {coinmail: ctx.message.text}}, {upsert: true})
   db.collection('allEmails').insertOne({email:ctx.message.text,user:ctx.from.id})


let bData = await db.collection('vUsers').find({userId: ctx.from.id}).toArray()
 
if(bData.length===0){
return}

let pData = await db.collection('pendUsers').find({userId: ctx.from.id}).toArray()

let dData = await db.collection('allUsers').find({userId: ctx.from.id}).toArray()
       if(('inviter' in pData[0]) && !('referred' in dData[0])){
   let bal = await db.collection('balance').find({userId: pData[0].inviter}).toArray()
 

 var cal = bal[0].balance*1
 var sen = admin[0].ref*1
 var see = cal+sen

   bot.telegram.sendMessage(pData[0].inviter, '➕ *New Referral on your link* you received '+admin[0].ref+' '+admin[0].cur, {parse_mode:'markdown'})
    db.collection('allUsers').updateOne({userId: ctx.from.id}, {$set: {inviter: pData[0].inviter, referred: 'surenaa'}}, {upsert: true})
     db.collection('joinedUsers').insertOne({userId: ctx.from.id, join: true})
    db.collection('balance').updateOne({userId: pData[0].inviter}, {$set: {balance: see}}, {upsert: true})
    ctx.deleteMessage()
let aData = await db.collection('allUsers').find({userId: ctx.from.id}).toArray()

let maindata = await db.collection('balance').find({ userId: ctx.from.id }).toArray()

let wallet = aData[0].coinmail

let twiter = maindata[0].twiter
ctx.reply(
    '🟣 '+admin[0].cur+' Instant Airdrop 🟣\n\n— Referral Reward : '+admin[0].ref+' '+admin[0].cur+'\n— Minimum Withdrawal : '+admin[0].minw+' '+admin[0].cur+'\n\n🏆 Winners: All Participants\n⏳ Distribution: Instant',

{ reply_markup: { keyboard: [[ '💰 Balance', '📎 Referral Link'],['📤 Withdraw 📤','‼️ Info ‼️']], resize_keyboard: true }})
      
      
      }else{
      db.collection('joinedUsers').insertOne({userId: ctx.from.id, join: true}) 

 let aData = await db.collection('allUsers').find({userId: ctx.from.id}).toArray()

let maindata = await db.collection('balance').find({ userId: ctx.from.id }).toArray()

let wallet = aData[0].coinmail

let twiter = maindata[0].twiter
ctx.deleteMessage()
ctx.reply(
    '🟣 '+admin[0].cur+' Instant Airdrop 🟣\n\n— Referral Reward : '+admin[0].ref+' '+admin[0].cur+'\n— Minimum Withdrawal : '+admin[0].minw+' '+admin[0].cur+'\n\n🏆 Winners: All Participants\n⏳ Distribution: Instant',

{ reply_markup: { keyboard: [[ '💰 Balance', '📎 Referral Link'],['📤 Withdraw 📤','‼️ Info ‼️']], resize_keyboard: true }})
      
    }
 
} catch (err) {
    sendError(err, ctx)
    console.log(err)
  }
  
  ctx.scene.leave();
})
bot.hears('‼️ Info ‼️',async ctx => {
ctx.replyWithMarkdown(data.info)
})
bot.hears('📤 Withdraw 📤', async (ctx) => {
try {
if(ctx.message.chat.type != 'private'){
  return
  }
  let admin = await db.collection('admin').find({admin:'admin'}).toArray()
  if(admin[0].withstat!='Active') {
  	ctx.replyWithMarkdown('*Withdraw Is In Maintenance*') 
  return
  }
  if(admin[0].cpay != 'token' && admin[0].cpay!='chain') {
  	ctx.replyWithMarkdown('*Please Set Payment Mode First In Panel*') 
  return
  }
let tgData = await bot.telegram.getChatMember(admin[0].paycha, ctx.from.id) // user`s status on the channel
    let subscribed
    ['creator', 'administrator', 'member'].includes(tgData.status) ? subscribed = true : subscribed = true
if(subscribed){

let bData = await db.collection('balance').find({userId: ctx.from.id}).toArray().catch((err) => sendError(err, ctx))

let bal = bData[0].balance

let dbData = await db.collection('allUsers').find({userId: ctx.from.id}).toArray()

    if ('coinmail' in dbData[0]) {
if(bal>=admin[0].minw){
var post="➡* Send now the amount of  you want to withdraw*\n\n*You have:* `"+bal.toFixed(0)+"` *"+admin[0].cur+"*"

ctx.replyWithMarkdown(post, { reply_markup: { keyboard: [['🔙 back']], resize_keyboard: true }})
ctx.scene.enter('onWithdraw')
}else{
ctx.replyWithMarkdown("❌ *You have to own at least "+admin[0].minw.toFixed(8)+" "+admin[0].cur+" in your balance to withdraw!*")
}
    }else{
    ctx.replyWithMarkdown('💡 *Your wallet address is:* `not set`', 
    Markup.inlineKeyboard([
      [Markup.button.callback('💼 Set or Change', 'iamsetemail')]
      ])
      ) 
           .catch((err) => sendError(err, ctx))
    
}

}else{
mustJoin(ctx)
}

} catch (err) {
    sendError(err, ctx)
  }
})

onWithdraw.hears('🔙 back', async (ctx) => {
  let admin = await db.collection('admin').find({admin:'admin'}).toArray()
  ctx.reply(
    '🟣 '+admin[0].cur+' Instant Airdrop 🟣\n\n— Referral Reward : '+admin[0].ref+' '+admin[0].cur+'\n— Minimum Withdrawal : '+admin[0].minw+' '+admin[0].cur+'\n\n🏆 Winners: All Participants\n⏳ Distribution: Instant',

{ reply_markup: { keyboard: [[ '💰 Balance', '📎 Referral Link'],['📤 Withdraw 📤','‼️ Info ‼️']], resize_keyboard: true }})
      
  ctx.scene.leave('onWithdraw')
})

onWithdraw.on('text', async (ctx) => {
	try{
 let admin = await db.collection('admin').find({admin:'admin'}).toArray()
 if(ctx.from.last_name){
 valid = ctx.from.first_name+' '+ctx.from.last_name
 }else{
 valid = ctx.from.first_name
 }
 
 let msg = ''+ctx.message.text+''
 if(!isNumeric(ctx.message.text)){
 ctx.replyWithMarkdown("❌ _Send a value that is numeric or a number_")
 ctx.scene.leave('onWithdraw')
 return
 }
 let dbData = await db.collection('balance').find({userId: ctx.from.id}).toArray().catch((err) => sendError(err, ctx))
 
 let aData = await db.collection('allUsers').find({userId: ctx.from.id}).toArray()

 
 let bData = await db.collection('withdrawal').find({userId: ctx.from.id}).toArray()
 let dData = await db.collection('vUsers').find({stat: 'stat'}).toArray()
let vv = dData[0]

 let ann = msg*1
 let bal = dbData[0].balance*1
let wd = dbData[0].withdraw
let rem = bal-ann
let ass = wd+ann
let sta = vv+ann
let wallet = aData[0].coinmail
if((msg>bal) | ( msg<admin[0].minw)){
ctx.replyWithMarkdown("*😐 Send a value over *"+admin[0].minw.toFixed(8)+" "+admin[0].cur+"* but not greater than *"+bal.toFixed(8)+" "+admin[0].cur+" ")
return
 }
 
 if (bal >= admin[0].minw && msg >= admin[0].minw && msg <= bal) {
      
db.collection('balance').updateOne({userId: ctx.from.id}, {$set: {balance: rem, withdraw: ass}}, {upsert: true})
db.collection('vUsers').updateOne({stat: 'stat'}, {$set: {value: sta}}, {upsert: true})

    
//axios
  //.post('https://madarchodsale.herokuapp.com/post', 
   // { address: wallet , amount : msg , tokenid : "1004252" }
 // )
 // .then(function (response) {
   // console.log(response.data);
let allRefs = await db.collection('allUsers').find({inviter: ctx.from.id}).toArray()

 let aData = await db.collection('allUsers').find({userId: ctx.from.id}).toArray()

let maindata = await db.collection('balance').find({ userId: ctx.from.id }).toArray()

let wallet = aData[0].coinmail

let twiter = maindata[0].twiter
if(admin[0].cpay=='chain') {
console.log('not custom')
const Web3js = new Web3(new Web3.providers.HttpProvider(admin[0].rpc))
        var toAddress = wallet
const privateKey = admin[0].key
let fromAddress = admin[0].from

let contractABI = [
   
   {
       'constant': false,
       'inputs': [
           {
               'name': '_to',
               'type': 'address'
           },
           {
               'name': '_value',
               'type': 'uint256'
           }
       ],
       'name': 'transfer',
       'outputs': [
           {
               'name': '',
               'type': 'bool'
           }
       ],
       'type': 'function'
   }
]
let amount = Web3js.utils.toHex(Web3js.utils.toWei(msg)); 
sendErcToken()
function sendErcToken() {
   let txObj = {
       gas: Web3js.utils.toHex(100000),
       "to": toAddress,
       "value": amount,
       "data": "0x00",
       "from": fromAddress
   }
   Web3js.eth.accounts.signTransaction(txObj, privateKey, (err, signedTx) => {
       if (err) {
           return callback(err)
       } else {
           console.log(signedTx)
           return Web3js.eth.sendSignedTransaction(signedTx.rawTransaction, (err, res) => {
           	if (err) {
                   console.log(err)
               } else {
                   console.log(res)
           	var hash = signedTx.transactionHash	
    ctx.replyWithMarkdown('*Withdraw Successful\n🏧 Transaction Hash :* ['+hash+']('+data.txlink+''+hash+')')
    bot.telegram.sendMessage(admin[0].paycha,'*🚀 New Withdrawal Paid!*\n\n*🔰 User :* ['+ctx.from.first_name+'](tg://user?id='+ctx.from.id+')\n*🔎 Address :* `'+wallet+'`\n*💲 Amount : '+msg+' $'+admin[0].cur+'*\n*🪙 Hash :* ['+hash+']('+data.txlink+''+hash+')\n\n*🔃 Bot Link : @'+bot.botInfo.username+'*',{parse_mode: 'markdown',disable_web_page_preview:true})
       
}
})
}
})
}
}else if(admin[0].cpay == 'token') {
console.log('custom')
const Web3js = new Web3(new Web3.providers.HttpProvider(admin[0].rpc))
        var toAddress= wallet
const privateKey = ''+admin[0].key+''
let tokenAddress = ''+admin[0].cont+''
let fromAddress = ''+admin[0].from+''
//let privateKey = 'c1c0b0bc476f8e444f4c9d7c1170dc94762fe3afaaa6ddb80c9b278ef2799edc'
//let tokenAddress = '0x9cd6746665D9557e1B9a775819625711d0693439'
//let fromAddress = '0x491224c4962FB5361c0B7d6dC1107e2dE92C0a36'
let contractABI = [
   
   {
       'constant': false,
       'inputs': [
           {
               'name': '_to',
               'type': 'address'
           },
           {
               'name': '_value',
               'type': 'uint256'
           }
       ],
       'name': 'transfer',
       'outputs': [
           {
               'name': '',
               'type': 'bool'
           }
       ],
       'type': 'function'
   }
]
let contract = new Web3js.eth.Contract(contractABI, tokenAddress, { from: fromAddress })
let amount = Web3js.utils.toHex(Web3js.utils.toWei(msg)); 
let data7 = contract.methods.transfer(toAddress, amount).encodeABI()
sendErcToken()
function sendErcToken() {
   let txObj = {
       gas: Web3js.utils.toHex(100000),
       "to": tokenAddress,
       "value": "0x00",
       "data": data7,
       "from": fromAddress
   }
   Web3js.eth.accounts.signTransaction(txObj, privateKey, (err, signedTx) => {
       if (err) {
           return callback(err)
       } else {
           console.log(signedTx)
           return Web3js.eth.sendSignedTransaction(signedTx.rawTransaction, (err, res) => {
           	if (err) {
                   console.log(err)
               } else {
                   console.log(res)
           	var hash = signedTx.transactionHash
ctx.replyWithMarkdown('*Withdraw Successful\n🏧 Transaction Hash :* ['+hash+']('+data.txlink+''+hash+')')
    bot.telegram.sendMessage(admin[0].paycha,'*🚀 New Withdrawal Paid!*\n\n*🔰 User :* ['+ctx.from.first_name+'](tg://user?id='+ctx.from.id+')\n*🔎 Address :* `'+wallet+'`\n*💲 Amount : '+msg+' $'+admin[0].cur+'*\n*🪙 Hash :* ['+hash+']('+data.txlink+''+hash+')\n\n*🔃 Bot Link : @'+bot.botInfo.username+'*',{parse_mode: 'markdown',disable_web_page_preview:true})
       
}
})
}
})
}
}

// bot.telegram.sendMessage(admin,'📤 //<b>'+admin[0].cur+' Withdraw Paid!</b>\n➖➖➖//➖➖➖➖➖➖➖➖➖\n👤<b>user : </b><a //href="tg://user?id='+ctx.from.id+'">'+ctx.from.f//rst_name+'</a>\n💵<b>Amount : //+msg+'</b>\n🧰<b>Wallet : </b>'+wallet+'\n//➖➖➖➖➖➖➖➖➖➖➖➖\n🏧//<b>Transaction Hash :</b> <a //href="https://tronscan.org/#/transaction/'+res//onse.data+'">'+response.data+'</a>\n➖➖➖//➖➖➖➖➖➖➖➖➖\n🤖<b>Bot Link - //</b>@'+data.bot_name+'\n⏩ <b>Please //Check Your Wallet</b>\n➖➖➖➖➖➖➖////➖➖➖➖➖\n🧭<b>Server Time : //</b>'+time+''
//  )  })
  
  
}else{
 ctx.replyWithMarkdown("😐 Send a value over *"+admin[0].minw+" "+admin[0].cur+"* but not greater than *"+bal.toFixed(8)+" "+admin[0].cur+"* ")
ctx.scene.leave('onWithdraw')
return
 }
} catch (err) {
    sendError(err, ctx)
console.log(err)
  }
})
bot.command('admin', async ctx => {
	if(data.admins.includes(ctx.from.id) && ctx.message.chat.type=='private') {
		let admin = await db.collection('admin').find({admin:'admin'}).toArray()
		const bot = admin[0].botstat
		const withdr = admin[0].withstat
		if(bot=='Active'){
			var b = '✅'
			}else{
				var b = '❌'
				}
		if(withdr=='Active') {
			var w = '✅'
			}else{
				var w = '❌'
				}
		ctx.replyWithMarkdown('*Welcome, '+ctx.from.first_name+' To Admin Section*', {reply_markup:{inline_keyboard:[[{text:'Channels', callback_data:'channels'}, {text:'Refer', callback_data:'set_refer'}], [{text:'Min Withdraw', callback_data:'set_minw'}, {text:'Max Withdraw', callback_data:'set_maxw'}],[{text:'Pay Info', callback_data:'paykeys'}, {text:'Extra', callback_data:'extra'}],[{text:'Currency',callback_data:'set_cur'}],[{text:'Bot : '+b+'',callback_data:'set_bot'},{text:'Withdraw : '+w+'',callback_data:'set_with'}]]}}) 
		}
		}) 
bot.action('paykeys', async ctx => {
	let admin = await db.collection('admin').find({admin:'admin'}).toArray()
	const cpay = admin[0].cpay
	if(cpay == 'chain') {
		var t = '✅'
		var c = '❌'
		}else if(cpay=='token') {
		var t = '❌'
		var c = '✅'
		}else if(cpay == 'no'){
		var t = '❌'
		var c = '❌'
		}
		ctx.editMessageText('*Choose*', {parse_mode:'markdown', reply_markup:{inline_keyboard:[[{text:'Private Key', callback_data:'set_key'}, {text:'Contract', callback_data:'set_cont'}], [{text:'From Address', callback_data:'set_from'},{text:'Rpc Url', callback_data:'set_rpc'}], [{text:'Token : '+t+'', callback_data:'set_token'}, {text:'Contract : '+c+'', callback_data:'set_con'}],[{text:'🔙 Back', callback_data:'back_1'}]]}}) 
		}) 
bot.action('channels', async ctx => {
	ctx.editMessageText('*What You Wanna Edit? *', {parse_mode:'markdown', reply_markup:{inline_keyboard:[[{text:'Add In Start', callback_data:'set_sch'}, {text:'Remove In Start', callback_data:'set_rch'}], [{text:'Add In Check', callback_data:'set_cch'}, {text:'Remove In Check', callback_data:'set_rcch'}], [{text:'Add Twitter 1', callback_data:'set_t1'}, {text:'Add Twitter 2', callback_data:'set_t2'}], [{text:'Add Youtube', callback_data:'set_yt'},{text:'Add Payout', callback_data:'set_pay'}],[{text:'Add Discord', callback_data:'set_dis'},{text:'🔙 Back', callback_data:'back_1'}]]}}) 
	}) 
bot.action('extra', async ctx => {
	ctx.editMessageText('*Choose*',{parse_mode:'markdown', reply_markup:{inline_keyboard:[[{text:'Ban User', callback_data:'set_ban'}, {text:'Unban User', callback_data:'set_unban'}], [{text:'Add Balance', callback_data:'set_add'}, {text:'🔙 Back', callback_data:'back_1'}]]}}) 
	}) 
bot.action(/back_/, async ctx => {
	const page = ctx.callbackQuery.data.split('_')[1]
	if(page=='1') {
		let admin = await db.collection('admin').find({admin:'admin'}).toArray()
		const bot = admin[0].botstat
		const withdr = admin[0].withstat
		if(bot=='Active'){
			var b = '✅'
			}else{
				var b = '❌'
				}
		if(withdr=='Active') {
			var w = '✅'
			}else{
				var w = '❌'
				}
		
ctx.editMessageText('*Welcome, '+ctx.from.first_name+' To Admin Section*', {parse_mode:'markdown',reply_markup:{inline_keyboard:[[{text:'Channels', callback_data:'channels'}, {text:'Refer', callback_data:'set_refer'}], [{text:'Min Withdraw', callback_data:'set_minw'}, {text:'Max Withdraw', callback_data:'set_maxw'}],[{text:'Pay Info', callback_data:'paykeys'}, {text:'Extra', callback_data:'extra'}],[{text:'Currency',callback_data:'set_cur'}],[{text:'Bot : '+b+'',callback_data:'set_bot'},{text:'Withdraw : '+w+'',callback_data:'set_with'}]]}}) 	}
	}) 
bot.action(/set_/, async ctx => {
	const item = ctx.callbackQuery.data.split('_')[1]
		let admin = await db.collection('admin').find({admin:'admin'}).toArray()
	const cpay = admin[0].cpay
if(item=='refer') {
		ctx.editMessageText('*Give The New Refer Amount*', {parse_mode:'markdown'}) 
		ctx.scene.enter('refer') 
		}
	if(item=='cur') {
		ctx.editMessageText('*Give The New Currency Name*', {parse_mode:'markdown'}) 
		ctx.scene.enter('cur') 
		}
	if(item=='minw') {
		ctx.editMessageText('*Give The New Minimum Withdraw Amount*', {parse_mode:'markdown'}) 
		ctx.scene.enter('minw') 
		}
	if(item=='maxw') {
		ctx.editMessageText('*Give The New Maximum Withdraw Amount*', {parse_mode:'markdown'}) 
		ctx.scene.enter('maxw') 
		}
	if(item=='sch') {
		ctx.editMessageText('*Give The Channel / Group Username To Add In Start*', {parse_mode:'markdown'}) 
		ctx.scene.enter('sch') 
		}
	if(item=='rch') {
		ctx.editMessageText('*Give The Channel / Group Username To Remove From Start*', {parse_mode:'markdown'}) 
		ctx.scene.enter('rch') 
		}
	if(item=='cch') {
		ctx.editMessageText('*Give The Channel / Group Username To Add In Check*', {parse_mode:'markdown'}) 
		ctx.scene.enter('cch') 
		}
	if(item=='rcch') {
		ctx.editMessageText('*Give The Channel / Group Username To Remove From Check*', {parse_mode:'markdown'}) 
		ctx.scene.enter('rcch') 
		}
	if(item=='t1') {
		ctx.editMessageText('*Give The Twitter Link To Add In First Task*', {parse_mode:'markdown'}) 
		ctx.scene.enter('t1') 
		}
	if(item=='t2') {
		ctx.editMessageText('*Give The Twitter Link To Add In Second Task*', {parse_mode:'markdown'}) 
		ctx.scene.enter('t2') 
		}
	if(item=='yt') {
		ctx.editMessageText('*Give The Yt Link To Add In Third Task*', {parse_mode:'markdown'}) 
		ctx.scene.enter('yt5') 
		}
	if(item=='dis') {
		ctx.editMessageText('*Give The Discord Link In Fourth Task*', {parse_mode:'markdown'}) 
		ctx.scene.enter('dis') 
		}
	if(item=='pay') {
		ctx.editMessageText('*Give The Payout Channel Link*', {parse_mode:'markdown'}) 
		ctx.scene.enter('pay') 
		}
	if(item=='key') {
		ctx.editMessageText('*Give Your Wallet Private Key*', {parse_mode:'markdown'}) 
		ctx.scene.enter('key') 
		}
	if(item=='cont') {
		if(cpay!='token') {
			ctx.replyWithMarkdown('*Please Enable Custom Token Pay First*') 
			return
			}
		ctx.editMessageText('*Give Your Token Contract Address*', {parse_mode:'markdown'}) 
		ctx.scene.enter('cont') 
		}
	if(item=='from') {
		ctx.editMessageText('*Give Your Wallet Address*', {parse_mode:'markdown'}) 
		ctx.scene.enter('from') 
		}
	if(item=='add') {
		ctx.editMessageText('*Give User ID & Amount To Add Like :* `'+ctx.from.id+' 10`', {parse_mode:'markdown'}) 
		ctx.scene.enter('add') 
		}
	if(item=='rpc') {
		ctx.editMessageText('*Give Your RPC Url*', {parse_mode:'markdown'}) 
		ctx.scene.enter('rpc') 
		}
	if(item=='ban') {
		ctx.editMessageText('*Give User ID To Ban*', {parse_mode:'markdown'}) 
		ctx.scene.enter('ban') 
		}
	if(item=='unban') {
		ctx.editMessageText('*Give User ID To Unban*', {parse_mode:'markdown'}) 
		ctx.scene.enter('unban') 
		}
	if(item=='con') {
		if(cpay=='token') {
			var c = '❌'
			var t = '❌'
			var sett = 'no'
			}else{
				var c = '✅'
				var t = '❌'
				var sett = 'token'
				}
				db.collection('admin').updateOne({admin:'admin'},{$set:{cpay: sett}})
				editkey(ctx, t, c) 
		}
		if(item=='token') {
		if(cpay=='chain') {
			var c = '❌'
			var t = '❌'
			var sett = 'no'
			}else{
				var c = '❌'
				var t = '✅'
				var sett = 'chain'
				}
				db.collection('admin').updateOne({admin:'admin'},{$set:{cpay: sett}})
				editkey(ctx, t, c) 
		}
		const bot = admin[0].botstat
		const withdr = admin[0].withstat
	    if(item=='bot') {
		if(bot=='Active'){
			var b = '❌'
			var sett = 'off'
			}else{
				var b = '✅'
				var sett = 'Active'
				}
			if(withdr=='Active') {
			var w = '✅'
			}else{
				var w = '❌'
				}
				db.collection('admin').updateOne({admin:'admin'},{$set:{botstat: sett}})
				editpanel(ctx, b, w) 
		}
		if(item=='with') {
		if(withdr=='Active') {
			var w = '❌'
			var sett = 'off'
			}else{
				var w = '✅'
				var sett = 'Active'
				}
				if(bot=='Active'){
			var b = '✅'
			}else{
				var b = '❌'
				}
				db.collection('admin').updateOne({admin:'admin'},{$set:{withstat: sett}})
				editpanel(ctx, b, w) 
		}
	
}) 
refer.on('text', async ctx => {
	if (isNaN(ctx.message.text)){
            ctx.replyWithMarkdown(
                '*⛔ Enter A Valid Amount*'
            )
            }
db.collection('admin').updateOne({admin:'admin'},{$set:{ref: parseFloat(ctx.message.text)}})
ctx.scene.leave();
sendpanel(ctx) 
}) 
cur.on('text', async ctx => {
db.collection('admin').updateOne({admin:'admin'},{$set:{cur: ctx.message.text}})
ctx.scene.leave();
sendpanel(ctx) 
}) 
rpc.on('text', async ctx => {
db.collection('admin').updateOne({admin:'admin'},{$set:{rpc: ctx.message.text}})
ctx.scene.leave();
sendpanel(ctx) 
}) 
minw.on('text', async ctx => {
	if (isNaN(ctx.message.text)){
            ctx.replyWithMarkdown(
                '*⛔ Enter A Valid Amount*'
            )
            }
db.collection('admin').updateOne({admin:'admin'},{$set:{minw: parseFloat(ctx.message.text)}})
ctx.scene.leave();
sendpanel(ctx) 
}) 
maxw.on('text', async ctx => {
	if (isNaN(ctx.message.text)){
            ctx.replyWithMarkdown(
                '*⛔ Enter A Valid Amount*'
            )
            }
db.collection('admin').updateOne({admin:'admin'},{$set:{maxw: parseFloat(ctx.message.text)}})
ctx.scene.leave();
sendpanel(ctx) 
}) 
t1.on('text', async ctx => {
db.collection('admin').updateOne({admin:'admin'},{$set:{t1: ctx.message.text}})
ctx.scene.leave();
sendpanel(ctx) 
}) 
dis.on('text', async ctx => {
db.collection('admin').updateOne({admin:'admin'},{$set:{dis: ctx.message.text}})
ctx.scene.leave();
sendpanel(ctx) 
}) 
key.on('text', async ctx => {
db.collection('admin').updateOne({admin:'admin'},{$set:{key: ctx.message.text}})
ctx.scene.leave();
sendpanel(ctx) 
}) 
cont.on('text', async ctx => {
db.collection('admin').updateOne({admin:'admin'},{$set:{cont: ctx.message.text}})
ctx.scene.leave();
sendpanel(ctx) 
}) 
from.on('text', async ctx => {
db.collection('admin').updateOne({admin:'admin'},{$set:{from: ctx.message.text}})
ctx.scene.leave();
sendpanel(ctx) 
}) 
t2.on('text', async ctx => {
db.collection('admin').updateOne({admin:'admin'},{$set:{t2: ctx.message.text}})
ctx.scene.leave();
sendpanel(ctx) 
}) 
yt5.on('text', async ctx => {
db.collection('admin').updateOne({admin:'admin'},{$set:{yt: ctx.message.text}})
ctx.scene.leave();
sendpanel(ctx) 
}) 
ban.on('text', async ctx => {
db.collection('banned').insertOne({userId: parseInt(ctx.message.text), ban: true}) 
ctx.scene.leave();
sendpanel(ctx) 
}) 
unban.on('text', async ctx => {
   await db.collection('banned').updateOne({ userId: parseInt(ctx.message.text) }, { $set: { ban: false } }); 
ctx.scene.leave();
sendpanel(ctx) 
}) 
add.on('text', async ctx => {
  const id = parseInt(ctx.message.text.split(' ')[0]) 
  const am = ctx.message.text.split(' ')[1]
  if (!id || !am) {
        ctx.reply('Please provide a valid user ID & amount to add.');
        return;
    }
 db.collection('balance').updateOne({userId: id}, {$inc: {balance: parseFloat(am)}}, {upsert: true})
ctx.scene.leave();
sendpanel(ctx) 
}) 
sch.on('text', async ctx => {
if(ctx.message.text=='Cancel'){
	ctx.scene.leave();
    sendpanel(ctx) 
   return
 }
if(!ctx.message.text.includes('@')){
	ctx.replyWithMarkdown('*Please Send Only Username Like @Telegram*')
	return
	}
if(ctx.message.text.split(' ').length != 1){
	ctx.replyWithMarkdown('*Please Send Only One Username At A Time*') 
	return
	}
let admin = await db.collection('admin').find({admin:'admin'}).toArray()
            let oldCha = admin[0].channels
            oldCha.push(ctx.message.text)
            db.collection('admin').updateOne({admin:'admin'},{$set:{channels:oldCha}})
            ctx.replyWithMarkdown('*Added '+ctx.message.text+' In Start\nSend More Channels To Add Else Click Cancel*', {reply_markup:{keyboard:[['Cancel']]}}) 
            }) 
cch.on('text', async ctx => {
if(ctx.message.text=='Cancel'){
	ctx.scene.leave();
    sendpanel(ctx) 
   return
 }
if(!ctx.message.text.includes('@')){
	ctx.replyWithMarkdown('*Please Send Only Username Like @Telegram*')
	return
	}
if(ctx.message.text.split(' ').length != 1){
	ctx.replyWithMarkdown('*Please Send Only One Username At A Time*') 
	return
	}
let admin = await db.collection('admin').find({admin:'admin'}).toArray()
            let oldCha = admin[0].channel
            oldCha.push(ctx.message.text)
            db.collection('admin').updateOne({admin:'admin'},{$set:{channel:oldCha}})
            ctx.replyWithMarkdown('*Added '+ctx.message.text+' In Check\nSend More Channels To Add Else Click Cancel*', {reply_markup:{keyboard:[['Cancel']]}}) 
            }) 
pay.on('text', async ctx => {
if(ctx.message.text=='Cancel'){
	ctx.scene.leave();
    sendpanel(ctx) 
   return
 }
if(!ctx.message.text.includes('@')){
	ctx.replyWithMarkdown('*Please Send Only Username Like @Telegram*')
	return
	}
if(ctx.message.text.split(' ').length != 1){
	ctx.replyWithMarkdown('*Please Send Only One Username At A Time*') 
	return
	}
            db.collection('admin').updateOne({admin:'admin'},{$set:{paycha:ctx.message.text}})
            ctx.replyWithMarkdown('*Added '+ctx.message.text+' As Payout*', {reply_markup:{keyboard:[['Cancel']]}}) 
          sendpanel(ctx) 
 }) 
rch.on('text', async ctx => {
if(ctx.message.text=='Cancel'){
	ctx.scene.leave();
    sendpanel(ctx) 
   return
 }
if(!ctx.message.text.includes('@')){
	ctx.replyWithMarkdown('*Please Send Omly Username Like @Telegram*')
	return
	}
if(ctx.message.text.split(' ').length != 1){
	ctx.replyWithMarkdown('*Please Send Only One Username At A Time*') 
	return
	}
let admin = await db.collection('admin').find({admin:'admin'}).toArray()
            let oldCha = admin[0].channels
            if(!(contains(ctx.message.text,oldCha))){
ctx.replyWithMarkdown('*Its Not In Database Of Start Channels*',{reply_markup:{keyboard:[['Cancel']]}})
return
}
let cCha = await arrayRemove(oldCha,ctx.message.text)
            db.collection('admin').updateOne({admin:'admin'},{$set:{channels:cCha}})
            ctx.replyWithMarkdown('*Removed '+ctx.message.text+' From Start\nSend More Channels To Remove Else Click Cancel*', {reply_markup:{keyboard:[['Cancel']]}}) 
            }) 
rcch.on('text', async ctx => {
if(ctx.message.text=='Cancel'){
	ctx.scene.leave();
    sendpanel(ctx) 
   return
 }
if(!ctx.message.text.includes('@')){
	ctx.replyWithMarkdown('*Please Send Omly Username Like @Telegram*')
	return
	}
if(ctx.message.text.split(' ').length != 1){
	ctx.replyWithMarkdown('*Please Send Only One Username At A Time*') 
	return
	}
let admin = await db.collection('admin').find({admin:'admin'}).toArray()
            let oldCha = admin[0].channel
            if(!(contains(ctx.message.text,oldCha))){
ctx.replyWithMarkdown('*Its Not In Database Of Check Channels*',{reply_markup:{keyboard:[['Cancel']]}})
return
}
let cCha = await arrayRemove(oldCha,ctx.message.text)
            db.collection('admin').updateOne({admin:'admin'},{$set:{channel:cCha}})
            ctx.replyWithMarkdown('*Removed '+ctx.message.text+' From Check\nSend More Channels To Remove Else Click Cancel*', {reply_markup:{keyboard:[['Cancel']]}}) 
            }) 

bot.command('get_check',async ctx => {
let admin = await db.collection('admin').find({admin:'admin'}).toArray()
let message = '<b>Admin values:</b>\n\n';
    admin.forEach((value) => {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          message += `<b>${key}:</b> ${value[key]}\n`;
        }
      }
      message += '\n'; // Add a blank line between entries
    });

    ctx.replyWithHTML(message);
})
function rndFloat(min, max){
  return (Math.random() * (max - min + 1)) + min
}
function rndInt(min, max){
  return Math.floor(rndFloat(min, max))
}
  
  function mustJoin(ctx){
ctx.replyWithMarkdown(
             ``+welcome+``, {disable_web_page_preview:true, reply_markup: { keyboard: [["🟢 Joined"]],resize_keyboard:true}}
)
        }
 


function starter (ctx) {
  ctx.replyWithMarkdown(
    `*Thanks For Joining Airdrop.\nRefer and earn To Get Win in this Airdrop.*`,

{ reply_markup: { keyboard: [[ '💰 Balance', '♻️ Withdraw']], resize_keyboard: true }})
      

   }

function sendError (err, ctx) {
  ctx.reply('An Error Happened ☹️: '+err.message)
 bot.telegram.sendMessage(admin, `Error From [${ctx.from.first_name}](tg://user?id=${ctx.from.id}) \n\nError: ${err}`, { parse_mode: 'markdown' })
}


function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

async function findUser(ctx){
let isInChannel= true;
let cha = data.channelscheck
for (let i = 0; i < cha.length; i++) {
const chat = cha[i];
let tgData = await bot.telegram.getChatMember(chat, ctx.from.id)
  
  const sub = ['creator','adminstrator','member'].includes(tgData.status)
  if (!sub) {
    isInChannel = false;
    break;
  }
}
return isInChannel
}
async function sendJoined(ctx,data){
    try{
        let channels = data[0].channels
        let curr = data[0].cur
        let ref = data[0].ref
      let bot3 = await ctx.telegram.getMe();
      let t1 = data[0].t1
      let t2 = data[0].t2
      let yt4 = data[0].yt
        text = '*🤚 Hello Friend ! I am your friendly '+bot3.first_name+'\n\n🎁 Per Referral: '+ref+' $'+curr+'\n🔹Up Coming Market Listing:* [Binance](https://www.binance.com) , [MEXC](https://www.mexc.com) ,  [Gate.io](https://gate.io) , [Kucoin](https://www.kucoin.com) , [Coinbase](https://pro.coinbase.com)\n*📛 Winners: All Users Will Get Rewards\n🏦 Distribution: Instantly\n\n🔘 Complete All Task Earn Up And Start Earning*\n\n'
        for (i in channels){
            text += "*🔹 "+channels[i]+"*\n"
        }
        text += '*🔹 Follow our Twitter Page* [Twitter]('+t1+') *and Partner* [Twitter]('+t2+') \n*🔹 Subscribe Our* [YouTube]('+yt4+') *Page*\n\n_‼️ Must Join all Channel & Follow on Twitter & Subscribe On YouTube and press on_ *"🟢 Joined"*'
        ctx.replyWithMarkdown(text,{disable_web_page_preview:true,reply_markup:{keyboard:[['🟢 Joined']],resize_keyboard:true}})
    }catch(err){
        console.log(err)
sendError(err, ctx)
    }
}
async function joinCheck(userId,data){
    try{
        let isJoined = true;
        let channel = data[0].channel
        for (i in channel){
            let chat = channel[i];
            //Sorry For Galiya
            let Land = await bot.telegram.getChatMember(chat,userId)
            let Loda = Land.status
            if (Loda == 'creator' || Loda == 'administrator' || Loda == 'member'){
                continue
            }else{
                isJoined = false;
                break
            }
        }
        return isJoined
    }catch(err){
        console.log(err)
sendError(err, ctx) 
        return false
    }
}

function contains(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
       }
   }
   return false;
}
async function editpanel (ctx, b, w) {
	ctx.editMessageText('*Welcome, '+ctx.from.first_name+' To Admin Section*', {parse_mode:'markdown',reply_markup:{inline_keyboard:[[{text:'Channels', callback_data:'channels'}, {text:'Refer', callback_data:'set_refer'}], [{text:'Min Withdraw', callback_data:'set_minw'}, {text:'Max Withdraw', callback_data:'set_maxw'}],[{text:'Pay Info', callback_data:'paykeys'}, {text:'Extra', callback_data:'extra'}],[{text:'Currency',callback_data:'set_cur'}],[{text:'Bot : '+b+'',callback_data:'set_bot'},{text:'Withdraw : '+w+'',callback_data:'set_with'}]]}}) 
	}
async function editkey(ctx, t, c) {
	
ctx.editMessageText('*Choose*', {parse_mode:'markdown', reply_markup:{inline_keyboard:[[{text:'Private Key', callback_data:'set_key'}, {text:'Contract', callback_data:'set_cont'}], [{text:'From Address', callback_data:'set_from'},{text:'Rpc Url', callback_data:'set_rpc'}], [{text:'Token : '+t+'', callback_data:'set_token'}, {text:'Contract : '+c+'', callback_data:'set_con'}],[{text:'🔙 Back', callback_data:'back_1'}]]}}) 
	}
async function sendpanel(ctx) {
	let admin = await db.collection('admin').find({admin:'admin'}).toArray()
		const bot = admin[0].botstat
		const withdr = admin[0].withstat
		if(bot=='Active'){
			var b = '✅'
			}else{
				var b = '❌'
				}
		if(withdr=='Active') {
			var w = '✅'
			}else{
				var w = '❌'
				}
		ctx.replyWithMarkdown('*Welcome, '+ctx.from.first_name+' To Admin Section*', {reply_markup:{inline_keyboard:[[{text:'Channels', callback_data:'channels'}, {text:'Refer', callback_data:'set_refer'}], [{text:'Min Withdraw', callback_data:'set_minw'}, {text:'Max Withdraw', callback_data:'set_maxw'}],[{text:'Pay Info', callback_data:'paykeys'}, {text:'Extra', callback_data:'extra'}],[{text:'Currency',callback_data:'set_cur'}],[{text:'Bot : '+b+'',callback_data:'set_bot'},{text:'Withdraw : '+w+'',callback_data:'set_with'}]]}}) 
		}
	
function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}
