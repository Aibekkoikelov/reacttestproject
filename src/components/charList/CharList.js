import { Component } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";
import PropTypes from "prop-types"
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
    charEnded: false,
    charSelected: false,
  };

  marvelservice = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onUpdateCharList = (char) => {
    let ended = false;
    if (char.length < 9) {
      ended = true;
    }
    this.setState(({ offset, charList }) => ({
      charList: [...charList, ...char],
      loaded: false,
      newListLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };
  onRequest = (offset) => {
    this.onCharListLoading();
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
// _______________________REF
  itemRefs = [];

  setRef = (ref) => {
    this.itemRefs.push(ref);
  };

  focusOnItem = (id) => {

    this.itemRefs.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    this.itemRefs[id].classList.add("char__item_selected");
    this.itemRefs[id].focus();
  };
  
  
// _____________________REF________________________________
  onRenderChar = (arr) => {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (item.thumbnail.indexOf("image_not_available") > 0) {
        imgStyle = { objectFit: "unset" };
      }

      
      return (
        // <li
        //   className="char__item"
        //   key={item.id}
        //   onClick={() => this.props.onCharSelected(item.id)}
        //   ref={this.myRef}
        // >
        //   <img src={item.thumbnail} alt={item.name} style={imgStyle} />
        //   <div className="char__name">{item.name}</div>
        // </li>
        <li
          className="char__item"
          tabIndex={0}
          ref={this.setRef}
          key={item.id}
          onClick={() => {
            this.props.onCharSelected(item.id);
            this.focusOnItem(i);
          }}
          onKeyPress={(e) => {
            if (e.key === " " || e.key === "Enter") {
              this.props.onCharSelected(item.id);
              this.focusOnItem(i);
            }
          }}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });
    return <ul className="char__grid">{items}</ul>;
  };

  render() {
    const { charList, loaded, error, offset, newListLoading, charEnded } =
      this.state;
    const items = this.onRenderChar(charList);
    let content = null

    if (loaded) {
      content = <Spinner />
    } else if (error) {
      content = <ErrorMessage />
    } else {
      content = items
    }

    return (
      <div className="char__list">
        {content}
        <button
          className="button button__main button__long"
          disabled={newListLoading}
          style={{ display: charEnded ? "none" : "block" }}
          onClick={() => this.onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}
CharList.propTypes = {
  onCharSelected: PropTypes.func  // проверка через зависимость prop-types на проверку пропсов на наличие правильных типов данных работает
  // только при разработке, нужно смотреть документацию того что можно использовать
}

export default CharList;
