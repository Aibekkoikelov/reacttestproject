import { Component } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";
import "./charList.scss";

class CharList extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    charList: [],
    loaded: true,
    error: false,
    newListLoading: false,
    offset: 210,
  };
  marvelservice = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }
  onUpdateCharList = (char) => {
    this.setState(({ offset, charList }) => ({
      char: [...charList, ...char],
      loaded: false,
      newListLoading: false,
      offset: offset + 9,
    }));
  };
    onRequest = (offset) => {
    this.onCharListLoading()
    this.marvelservice
      .getAllCharacters(offset)
      .then(this.onUpdateCharList)
      .catch(this.onError);
  };
//   componentDidUpdate(prevState) {
//     if (this.state.newListLoading !== prevState.newListLoading) {
//       this.onCharListLoading();
//     }
//   }

  onCharListLoading = () => {
    this.setState({
      newListLoading: true,
    });
  };
  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  onRenderChar = (arr) => {
    const items = arr.map((item) => {
      let imgStyle = { objectFit: "cover" };
      if (item.thumbnail.indexOf("image_not_available") > 0) {
        imgStyle = { objectFit: "unset" };
      }
      return (
        <li
          className="char__item"
          key={item.id}
          onClick={() => this.props.onCharSelected(item.id)}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });
    return <ul className="char__grid">{items}</ul>;
  };

  render() {
    const { charList, loaded, error, offset, newListLoading } = this.state;
    const items = this.onRenderChar(charList);
    const spinner = loaded ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const content = !(loaded || error) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          className="button button__main button__long"
          disabled={newListLoading}
          onClick={()=>this.onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
