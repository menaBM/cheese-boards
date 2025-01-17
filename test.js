const {User, Board,  Cheese} = require('./models')
const seed = require("./db/seed")

describe("testing the models", ()=>{
    test("creating a user", async () => {
        
        await seed()
        
        await User.create({
            name: "emily",
            email: "emily@email.com"
        })
        const emily =  await User.findByPk("emily")
        expect(emily.email).toBe("emily@email.com")
    })

    test("a user has name and email attributes", async ()=>{
        const emily =  (await User.findByPk("emily")).get({plain:true})
        expect(emily).toHaveProperty("name")
        expect(emily).toHaveProperty("email")
    })

    test("deleting a user", async () => {
        const emily =  await User.findByPk("emily")
        await emily.destroy()
        const emily2 =  await User.findByPk("emily")
        expect(emily2).toBe(null)
    })

    test("creating a board", async () => {
        await Board.create({
            type: "type 1",
            description: "a very fancy cheeseboard",
            rating: 7
        })
        const board1 =  await Board.findByPk("type 1")
        expect(board1.rating).toBe(7)
    })

    test("a board has type, description and rating attributes", async ()=>{
        const board =  (await Board.findByPk("type 1")).get({plain:true})
        expect(board).toHaveProperty("type")
        expect(board).toHaveProperty("description")
        expect(board).toHaveProperty("rating")
    })

    test("deleting a board", async () => {
        const board =  await Board.findByPk("type 1")
        await board.destroy()
        const board2 =  await Board.findByPk("emily")
        expect(board2).toBe(null)
    })

    test("creating a Cheese", async () => {
        await Cheese.create({
            title: "Pecorino",
            description: "Comes in large cylinders with a hard, yellow rind encasing a yellowish-white interior"
        })
        const Cheese1 =  await Cheese.findByPk("Pecorino")
        expect(Cheese1.description).toBe("Comes in large cylinders with a hard, yellow rind encasing a yellowish-white interior")
    })

    test("a cheese has title and description attributes", async ()=>{
        const cheese =  (await Cheese.findByPk("Pecorino")).get({plain:true})
        expect(cheese).toHaveProperty("title")
        expect(cheese).toHaveProperty("description")
    })

    test("deleting a Cheese", async () => {
        const cheese =  await Cheese.findByPk("Pecorino")
        await cheese.destroy()
        const cheese2 =  await Cheese.findByPk("Pecorino")
        expect(cheese2).toBe(null)
    })

})

describe("testing the associations", ()=>{
    test("multiple boards can be added to a user", async ()=>{
        await seed()
        
        const user = await User.create({
            name: "emily",
            email: "emily@email.com"
        })

        boards = await Board.bulkCreate([
            {
                type: "type 1",
                description: "a very fancy cheeseboard",
                rating: 7
            },
            {
                type: "type 2",
                description: "a not very good cheeseboard",
                rating: 2
            },
            {
                type: "type 3",
                description: "an ok cheeseboard",
                rating: 4
            }
        ])

        await user.addBoards(boards)
        const array = await user.getBoards()
        expect(array.length).toBe(3)
    })  
        

    test("a cheese can be added to many boards", async ()=>{
        await seed()
       
        cheese = await Cheese.create({
            title: "Pecorino",
            description: "Comes in large cylinders with a hard, yellow rind encasing a yellowish-white interior"
        })

        boards = await Board.bulkCreate([
            {
                type: "type 1",
                description: "a very fancy cheeseboard",
                rating: 7
            },
            {
                type: "type 2",
                description: "a not very good cheeseboard",
                rating: 2
            },
            {
                type: "type 3",
                description: "an ok cheeseboard",
                rating: 4
            }
        ])

        await cheese.addBoards(boards)
        const array = await cheese.getBoards()
        expect(array.length).toBe(3)
    })

    test("a board can have many cheeses", async ()=>{
       
        const board = await Board.create({
            type: "type 4",
            description: "an amazing cheeseboard",
            rating: 10
        })

        const cheeses = await Cheese.bulkCreate([
            {
                title: "Parmesan",
                description: "The flavor power of parmesan can take a savory dish from acceptable to amazing with a dusting of this delicious cheese. Lots of words are used to describe parmesan: rich, tangy, nutty, sharp, complex, fruity, and bold to name a few. It has a somewhat gritty texture and a strong umami taste."
            },
            {
                title: "Cheddar",
                description: "The texture is slightly buttery, moist, and a little melty. It's truly a versatile crowd-pleaser. Aged cheddars become more nutty, crumbly, and sharp. During the aging process the cheese develops a slightly tangier finish, some earthy notes, and some hard salt-like crystals that add a slight crunch to each bite."
            },
            {
                title: "Asiago",
                description: "Asiago is a semi-hard cow's milk cheese that originated in Italy. Depending on how long this versatile cheese is aged, it can assume a variety of textures. Whether you prefer your cheese nice and smooth or enjoy a more crumbly texture, Asiago is the cheese every cheese lover can indulge in."
            },
            {
                title:"Gruyere",
                description: "Gruyère is a firm yellow Swiss cheese. It is named after the town of Gruyères in Switzerland. Gruyère is generally aged for six months or longer and is made from whole cow's milk. It features very few small eyes (or holes), an unusual characteristic for Swiss cheese."
            }      
        ])

        await board.addCheeses(cheeses)
        const array = await board.getCheeses()
        expect(array.length).toBe(4)
    })
})

describe("testing the eager loading", ()=>{
    
    test("a board can be loaded with its cheeses", async ()=>{
        const test = (await Board.findOne({
            attributes:["type"],
            where : {type : "type 4"},
            include: {
                model: Cheese,
                attributes: ["title"],
                through: {
                    attributes: []
                }
            }
        })).get({plain: true})

        let titles = []
        test.Cheeses.forEach(element => { titles.push(element.title)})
        expect(titles).toEqual([ 'Parmesan', 'Cheddar', 'Asiago', 'Gruyere' ])
    })

    test("a user can be loaded with its boards", async() =>{
        
        const allBoards = await Board.findAll()
        const user = await User.create({
            name: "emily",
            email: "emily@email.com"
        })
        
        await user.addBoards(allBoards)
        const emily = (await User.findOne({
            where:{name:"emily"},
            attributes:["name"],
            include: {
                model: Board,
                attributes: ["type"]
            }
        })).get({plain: true})

        let types = []
        emily.Boards.forEach(element => { types.push(element.type)})
        expect(types).toEqual([ 'type 1', 'type 2', 'type 3', 'type 4' ])
    })

    test("a cheese can be loaded with its boards", async() =>{
        
        const allBoards = await Board.findAll()
        const cheese = await Cheese.findOne()
        await cheese.addBoards(allBoards)
        
        const cheese1 = (await Cheese.findOne({
            where: {title: "Pecorino"},
            attributes:["title"],
            include: {
                model: Board,
                attributes: ["type"]
            }
        })).get({plain: true})

        let types = []
        cheese1.Boards.forEach(element => { types.push(element.type)})
        expect(types).toEqual([ 'type 1', 'type 2', 'type 3', 'type 4' ])
    })    
})