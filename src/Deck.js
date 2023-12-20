import React, {useState, useEffect} from "react";
import axios from "axios";
import Card from "./Card";

const Deck = ()=>{
    const [deckId, setDeckId] = useState(null)
    const [baseUrl, setBaseUrl] = useState(`https://deckofcardsapi.com/api/deck/`)
    const [cards, setCards] = useState([])
    const [cardsRemaining, setCardsRemaining] = useState(52)

    useEffect(()=>{
        console.log('using effect')
        axios.get(baseUrl+"new/shuffle/?deck_count=1").then(res => setDeckId(()=>(res.data.deck_id)))
        }
    ,[])
    
    const drawCard = async ()=>{
        try{
            const {data} = await axios.get(baseUrl+deckId+"/draw/?count=1")
            console.log(data.cards[0].image)
            setCards([...cards, data.cards[0].image])
            setCardsRemaining(data.remaining)
        }catch(err){
            alert('There are no more cards!')
        }
    }

    

    return (
        <div className="Deck">
            <button className="Deck-DrawButton" onClick={drawCard}> Draw</button>
            <div className="Deck-Container">
                <h3>Cards Remaining: {cardsRemaining}</h3>
                {cards.map(c => <Card url={c} />)}
            </div>
        </div>
    )
}

export default Deck;