import React from 'react';
import ReactDOM from 'react-dom';
import { a } from './tree-shaking';
import './search.css';
import './searchLess.less';
import logo from '../img/logo.jpg';

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      Text: null,
    };
  }

  handleLoading() {
    // 动态加载语法
    import('./Text.js').then((Text) => {
      console.log(Text.default());
      this.setState({
        Text: Text.default(),
      });
    });
  }

  render() {
    const { Text } = this.state;
    return (
      <div className="a search-Text">
        {/* {Text ?  <Text/> : null} */}
        <img
          src={logo}
          style={{
            width: 100,
            height: 100,
          }}
          onClick={() => {
            this.handleLoading();
          }}
        />
      </div>
    );
  }
}
ReactDOM.render(
  <Search />,
  document.getElementById('root'),
);
