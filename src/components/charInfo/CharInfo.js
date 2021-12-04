import { Component } from "react";
import "./charInfo.scss";
import PropTypes from "prop-types";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from '../spinner/Spinner'
import Skeleton from "../skeleton/Skeleton"

class CharInfo extends Component {
  state = {
    char: null,
    loading: false,
    error: false,
  };
    marvelService = new MarvelService();
    componentDidMount() {
        this.updateChar()
    }
    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar()
        }
    }

  updateChar = () => {
    const { charId } = this.props;
    if (!charId) {
      return;
    }
    this.canselError()
    this.onLoading();
    this.marvelService
      .getCharacter(charId)
      .then(this.onCharLoaded)
        .catch(this.onError);
      
     
  };
  canselError = () => {
    this.setState({ error : false})
  }
  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };
  onLoading = () => {
    this.setState({
      loading: true,
    });
  };

  onCharLoaded = (char) => {
    this.setState({ char, loading: false });
  };

    render() {
        const { char, loading, error } = this.state;
        const skeleton = char || loading || error ? null : <Skeleton/>
        const errorMessage = error ? <ErrorMessage /> : null
        const spinner = loading ? <Spinner /> : null
        const content = !(loading || error || !char) ? <View char={char} /> : null;
    return (
      <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
      </div>
    );
  }
}
const View = ({ char }) => {
    const {name, thumbnail, description, homepage, wiki, comics} = char
    let imgUrl = thumbnail.indexOf("image_not_available") > 0 ? "contain" : "cover";
    return (
      <>
        <div className="char__basics">
          <img src={thumbnail} alt={name} style={{ objectFit: imgUrl }} />
          <div>
            <div className="char__info-name">{name}</div>
            <div className="char__btns">
              <a href={homepage} className="button button__main">
                <div className="inner">homepage</div>
              </a>
              <a href={wiki} className="button button__secondary">
                <div className="inner">Wiki</div>
              </a>
            </div>
          </div>
        </div>
        <div className="char__descr">{description}</div>
        <div className="char__comics">Comics:</div>
        <ul className="char__comics-list">
          {comics.length > 0 ? null : "There is charachter dont have comics"}
          {comics.map((item, i) => {
            if (i < 10) {
              return (
                <li key={i} className="char__comics-item">
                  <a href={item.resourceURI}>{item.name}</a>
                </li>
              );
            }
          })}
        </ul>
      </>
    );
}
// CharInfo.propTypes = {
//   charId:PropTypes.number

// }

export default CharInfo;
