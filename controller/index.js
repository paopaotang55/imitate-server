const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')
const { Users, Boards, Containers, Cards } = require('../models/index')
const { tokenVerify, tokenSign, cryptoPassword } = require('./secret')
const secret = require('../config/secret')
const Op = Sequelize.Op

Boards.belongsTo(Users, {
    foreignKey: 'user_id',
    targetKey: 'id'
})
Containers.belongsTo(Boards, {
    foreignKey: 'board_id',
    targetKey: 'id'
})
Cards.belongsTo(Containers, {
    foreignKey: 'container_id',
    targetKey: 'id'
})
Containers.hasMany(Cards, {
    foreignKey: 'container_id',
    sourceKey: 'id'
})
module.exports = {
    users: {
        login: async (req, res) => {
            let { username, password } = req.body
            try{
                let user = await Users.findOne({where: {username, password: cryptoPassword(password)}})
                if(user){
                    res.status(200).send({
                        code: 0,
                        token: tokenSign({id: user.id, username })
                    })
                } else {
                    res.status(409).send({
                        code: 1,
                        message: "username/password 일치하지 않음"
                    })
                }
            } catch{
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
            
        },
        register: async (req, res) => {
            let { username, password } = req.body
            try{
                let user = await Users.findOne({where: {username}})
                if(!user){
                    let result = await Users.create({username, password: cryptoPassword(password)})
                    res.status(200).send({
                        code: 0,
                        token: tokenSign({id: result.id, username })
                    })
                } else {
                    res.status(409).send({
                        code: 1,
                        message: "username 이미 존재함"
                    })
                }
            } catch {
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
        },
        editPassword: async (req, res) => {
            let { password, password2 } = req.body
            let { username } = req.user
            try{
                let user = await Users.findOne({where: { username, password: cryptoPassword(password) }})
                if(user){
                    await Users.update({password: cryptoPassword(password2)}, {where: { username }})
                    res.status(200).send({
                        code: 0,
                        message: "비밀번호 수정 완료"
                    })
                } else {
                    res.status(404).send({
                        code: 1,
                        message: '예전 비밀번호가 틀렸습니다'
                    })
                }
            } catch(err){
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
        },
        deleteUser: async (req, res) => {
            let { id } = req.user
            try{ 
                let all1 = await Boards.findAll({
                    attributes: ["id"],
                    where: { user_id: id}})
                let boardId = all1.map(item => item.id)
                let all2 = await Containers.findAll({ 
                    attributes: ["id"],
                    where: {
                        board_id: {
                            [Op.in]: boardId
                        }
                    }
                })
                let containerId = all2.map(item => item.id)
                let all3 = await Cards.findAll({ 
                    attributes: ["id"],
                    where: {
                        container_id: {
                            [Op.in]: containerId
                        }
                    }
                })
                let cardId = all3.map(item => item.id)
                await Users.destroy({where: { id }})
                await Boards.destroy({where: {user_id: id }})
                await Containers.destroy({ where: { id: { [Op.in]: containerId }}})
                await Cards.destroy({ where: { id: { [Op.in]: cardId }}})
                res.status(200).send({
                    code: 0,
                    message: '회원탈퇴 성공'
                })
            } catch(err){
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
        },
        checkToken: async (req, res, next) => {
            let token = req.headers.authorization
            if(token){
                if(tokenVerify(token)){
                    try{
                        req.user = await jwt.verify(token, secret)
                        next()
                    } catch {
                        res.status(401).send({
                            code: 1,
                            message: 'token 문제 있습니다!'
                        })
                    }
                } else {
                    res.status(401).send({
                        code: 1,
                        message: 'token 문제 있습니다!'
                    })
                }
            } else {
                res.status(401).send({
                    code: 1,
                    message: 'token 없습니다!'
                })
            }
        }
    },
    boards: {
        getBoards: async (req, res) => {
            let { id } = req.user
            try{
                let boards = await Boards.findAll({
                    attributes: ["id", "boardName"],
                    where: {user_id: id}})
                res.status(200).send({
                    code: 0,
                    data: boards
                })
            } catch {
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
        },
        addBoard: async (req, res) => {
            let { id } = req.user
            let { boardName } = req.body
            try{
                await Boards.create({boardName, user_id: id})
                res.status(201).send({
                    code: 0,
                    message: 'board 생성함'
                })
            } catch (err) {
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
        },
        addContainer: async (req, res) => {
            // let { id } = req.user
            let { containerName, board_id } = req.body
            try{
                await Containers.create({ containerName, board_id })
                res.status(201).send({
                    code: 0,
                    message: 'container 생성함'
                })
            } catch (err) {
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
        },
        addCard: async (req, res) => {
            // let { id } = req.user
            let { cardName, container_id } = req.body
            try{
                await Cards.create({ cardName, container_id })
                res.status(201).send({
                    code: 0,
                    message: 'card 생성함'
                })
            } catch (err) {
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
        },
        getContainers: async (req, res) => {
            let { board_id } = req.query
            try{
                let containers = await Containers.findAll({
                    attributes: ['id', 'containerName'],
                    include:[
                        { model: Cards, attributes: ['id', 'cardName'] }
                    ],
                    where: { board_id }
                })
                res.status(200).send({
                    code: 0,
                    data: containers
                })
            } catch (err) {
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
            
        },
        deleteCard: async (req, res) => {
            let { id } = req.query
            try{ 
                await Cards.destroy({ where: { id } })
                res.status(200).send({
                    code: 0,
                    message: 'card 삭제됨'
                })
            } catch(err){
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
        },
        deleteContainer: async (req, res) => {
            let { id } = req.query
            try{ 
                await Cards.destroy({ where: { container_id: id } })
                await Containers.destroy({ where: { id } })
                res.status(200).send({
                    code: 0,
                    message: 'container 삭제됨'
                })
            } catch(err){
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
        },
        deleteBoard: async (req, res) => {
            let { id } = req.query
            try{ 
                let ids = await Containers.findAll({
                    attributes: ["id"],
                    where: { board_id: id}})
                let allId = ids.map(item => item.id)
                await Cards.destroy({ where: {
                    container_id: {
                        [Op.in]: allId
                    }
                }})
                await Containers.destroy({where: { board_id: id }})
                await Boards.destroy({where: { id }})
                res.status(200).send({
                    code: 0,
                    message: 'board 삭제됨'
                })
            } catch(err){
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
        },
        editBoard: async (req, res) => {
            let { id, boardName } = req.body
            try{
                await Boards.update({ boardName }, {where: { id }})
                res.status(200).send({
                    code: 0,
                    message: "board 수정 완료"
                })
            } catch(err){
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
        },
        editContainer: async (req, res) => {
            let { id, containerName } = req.body
            try{
                await Containers.update({ containerName }, {where: { id }})
                res.status(200).send({
                    code: 0,
                    message: "container 수정 완료"
                })
            } catch(err){
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
        },
        editCard: async (req, res) => {
            let { id, cardName } = req.body
            try{
                await Cards.update({ cardName }, {where: { id }})
                res.status(200).send({
                    code: 0,
                    message: "card 수정 완료"
                })
            } catch(err){
                res.status(500).send({
                    code: 1,
                    message: '서버에 문제 있습니다!!'
                })
            }
        }
    }
}