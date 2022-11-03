const {User, Board,  Cheese} = require('./models')
const db = require("./db/db")

describe("testing the models", ()=>{
    
    test("creating a user", async () => {
        await User.create({
            name: "emily",
            email: "emily@email.com"
        })
        const emily =  await User.findByPk("emily")
        expect(emily.email).toBe("emily@email.com")
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

    test("deleting a Cheese", async () => {
        const cheese =  await Cheese.findByPk("Pecorino")
        await cheese.destroy()
        const cheese2 =  await Cheese.findByPk("Pecorino")
        expect(cheese2).toBe(null)
    })

})
