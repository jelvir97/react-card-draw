import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import Card from "./Card";

const baseUrl =`https://deckofcardsapi.com/api/deck/`

const Deck = ()=>{
    const [deckId, setDeckId] = useState(null)
    const [cards, setCards] = useState([])
    const [cardsRemaining, setCardsRemaining] = useState(52)

    const [shuffling, setShuffling] = useState(false)
    const [drawing, setDrawing] = useState(false)
    const timerId = useRef(null)

    useEffect(()=>{
        console.log('using effect')
        axios.get(baseUrl+"new/shuffle/?deck_count=1").then(res => setDeckId(()=>(res.data.deck_id)))
        }
    ,[])
    
    useEffect( ()=>{
        const drawCard = async ()=>{
            try{
                const {data} = await axios.get(baseUrl+deckId+"/draw/?count=1")
                setCardsRemaining(data.remaining)
                setCards(cards=>[...cards, {img: data.cards[0].image, code: data.cards[0].code}])
                if (data.remaining === 0) throw new Error("Deck empty!");
                
            }catch(err){
                console.log('No more cards')
                setDrawing(false)
                alert(err)
            }
        }

        if(!drawing && timerId.current){
            console.log('shutting down timer')
            clearInterval(timerId.current)
            timerId.current = null;
        } 

        if(drawing){
            timerId.current = setInterval(drawCard, 500)
        }


    }, [drawing])


    const drawSingleCard = async ()=>{
        try{
            const {data} = await axios.get(baseUrl+deckId+"/draw/?count=1")

            setCards([...cards, {img: data.cards[0].image, code: data.cards[0].code}])
            setCardsRemaining(data.remaining)
        }catch(err){
            alert('There are no more cards!')
        }
    }

    const shuffleCards = async ()=>{
        try{
            setShuffling(true)
            const {data} = await axios.get(baseUrl+deckId+"/shuffle")
            setCardsRemaining(data.remaining)
            setCards([])
            
        }catch(err){
            alert('There was an error')
        }finally{
            setShuffling(false)
        }
    }

    const autoDraw = ()=>{
        setDrawing(!drawing)
    }


    return (
        <div className="Deck">
            <button className="Deck-DrawButton" onClick={autoDraw} disabled={shuffling}>{drawing? "Stop":"Start"} Auto-Draw</button>
            <button className="Deck-DrawButton" onClick={drawSingleCard} disabled={shuffling||drawing}>Draw</button>
            <button className="Deck-ShuffleButton" onClick={shuffleCards} disabled={shuffling||drawing}>{shuffling? '...loading':"Shuffle"}</button>
            <div className="Deck-Container">
                <h3>Cards Remaining: {cardsRemaining}</h3>
                {cards.map(c => <Card url={c.img} key={c.code}/>)}
            </div>
        </div>
    )
}

export default Deck;