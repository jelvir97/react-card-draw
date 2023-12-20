import React, {useState, useEffect} from "react";
import axios from "axios";
import Card from "./Card";

const Deck = ()=>{
    const [deckId, setDeckId] = useState(null)
    const [baseUrl, setBaseUrl] = useState(`https://deckofcardsapi.com/api/deck/`)
    const [cards, setCards] = useState([])
    const [cardsRemaining, setCardsRemaining] = useState(52)
    const [shuffling, setShuffling] = useState(false)

    useEffect(()=>{
        console.log('using effect')
        axios.get(baseUrl+"new/shuffle/?deck_count=1").then(res => setDeckId(()=>(res.data.deck_id)))
        }
    ,[])
    
    const drawCard = async ()=>{
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


    return (
        <div className="Deck">
            <button className="Deck-DrawButton" onClick={drawCard} disabled={shuffling}>Draw</button>
            <button className="Deck-ShuffleButton" onClick={shuffleCards} disabled={shuffling}>{shuffling? '...loading':"Shuffle"}</button>
            <div className="Deck-Container">
                <h3>Cards Remaining: {cardsRemaining}</h3>
                {cards.map(c => <Card url={c.img} key={c.code}/>)}
            </div>
        </div>
    )
}

export default Deck;