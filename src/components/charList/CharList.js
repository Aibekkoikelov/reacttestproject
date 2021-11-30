import {Component} from 'react'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import MarvelService from "../../services/MarvelService";
import "./charList.scss";

class CharList extends Component {
    state = {
        char: [],
        loaded: true,
        error: false
    }
    marvelservice = new MarvelService();

    componentDidMount() {
        this.marvelservice.getAllCharacters().then(this.onUpdateCharList).catch(this.onError);
    }
    onUpdateCharList = (char) => {
        this.setState({
            char,
            loaded: false
        })

    }
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onRenderChar = (arr) => {
        const items = arr.map(item => {
            let imgStyle = { 'objectFit': 'cover' }
            if (item.thumbnail.indexOf("image_not_available") > 0) {
                imgStyle = { 'objectFit': 'unset' };
            }
            return (
              <li className="char__item" key={item.id}>
                <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                <div className="char__name">{item.name}</div>
              </li>
            );
        })
        return <ul className="char__grid">
            {items}
        </ul>;
    }

   
    
    render() {
        const { char, loaded, error } = this.state
        const items = this.onRenderChar(char)
        const spinner = loaded ? <Spinner /> : null
        const errorMessage = error ? <ErrorMessage /> : null
        const content = !(loaded || error) ? items : null
        

        return (
    <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
      <button className="button button__main button__long">
        <div className="inner">load more</div>
      </button>
    </div>
  );

    }

  
}



export default CharList;
