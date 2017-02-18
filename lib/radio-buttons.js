'use strict';
var React = require('react');
var ReactNative = require('react-native');

const {
  Text,
  TouchableWithoutFeedback,
  View,
} = ReactNative;

const propTypes = {
  options: React.PropTypes.array.isRequired,
  testOptionEqual: React.PropTypes.func,
  renderOption: React.PropTypes.func,
  renderContainer: React.PropTypes.func,
  onSelection: React.PropTypes.func,
};

class RadioButtons extends React.Component {
  constructor(){
    super();
    this.state = {
      selectedValue: null,
      selectedIndex: null,
    };
  }

  copySelectedValueFromProps({selectedValue, selectedIndex}){
    this.setState({
      selectedValue,
      selectedIndex,
    });
  }

  componentWillMount(){
    this.copySelectedValueFromProps(this.props);
  }

  componentWillReceiveProps(newProps){
    this.copySelectedValueFromProps(newProps);
  }

  selectValue(selectedValue, selectedIndex){
    this.setState({
      selectedValue,
      selectedIndex,
    });
    this.props.onSelection(selectedValue, selectedIndex);
  }

  render() {
    const {selectedValue, selectedIndex} = this.state;

    const children = this.props.options.map(function(option, index){
      const isSelected = selectedIndex === index || this.props.testOptionEqual(selectedValue, option.value);
      const onSelection = this.selectValue.bind(this, option.value, index);

      return this.props.renderOption(option, isSelected, onSelection, index);
    }.bind(this));

    return this.props.renderContainer(children);
  }

  static getTextOptionRenderer(normalStyle, selectedStyle, extractText) {
    return function renderOption(option, selected, onSelect, index){
      const style = selected ? selectedStyle : normalStyle;
      const label = option.label;
      return (
        <TouchableWithoutFeedback onPress={onSelect} key={index}>
          <Text style={style}>{label}</Text>
        </TouchableWithoutFeedback>
      );
    };
  }
  static getViewContainerRenderer(style) {
    return function renderContainer(options){
      return <View style={style}>{options}</View>;
    };
  }
}

RadioButtons.renderHorizontalContainer = RadioButtons.getViewContainerRenderer({
  flexDirection: 'row',
});

RadioButtons.renderVerticalContainer = RadioButtons.getViewContainerRenderer({
  flexDirection: 'column'
});

RadioButtons.defaultProps = {
  testOptionEqual(a, b){
    return a === b;
  },
  renderOption: RadioButtons.getTextOptionRenderer({}, { fontWeight: 'bold' }),
  renderContainer: RadioButtons.renderVerticalContainer,
  onSelection(option){}
};
RadioButtons.propTypes = propTypes;

module.exports = RadioButtons;
