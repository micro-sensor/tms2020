import React from "react";
import { shallow, mount } from "enzyme";
import sinon from "sinon";

import HomeTile from "./HomeTile";
import img from "../../resources/category.png";
import { Typography, Button, CardActionArea } from "@material-ui/core";

describe("<HomeTile/>", () => {
  it("renders a card", () => {
    const wrapper = shallow(<HomeTile />);
    expect(wrapper.find(HomeTile)).toBeTruthy();
  });

  it("renders correct contents", () => {
    const wrapper = mount(
      <HomeTile
        title="Categories"
        description="CategoryDesc"
        image={img}
        buttonLabel="edit"
      />
    );

    expect(wrapper.find(Typography)).toBeTruthy();
    expect(wrapper.text()).toContain("Categories");
    expect(wrapper.text()).toContain("CategoryDesc");
    expect(wrapper.find(Button)).toBeTruthy();
    expect(wrapper.text()).toContain("edit");
    expect(wrapper.find(img)).toBeTruthy();
  });

  it("simulates click events", () => {
    const onButtonClick = sinon.spy();
    const wrapper = shallow(<HomeTile onClick={onButtonClick} />);
    wrapper.find(Button).simulate("click");
    expect(onButtonClick).toHaveProperty("callCount", 1);
    wrapper.find(CardActionArea).simulate("click");
    expect(onButtonClick).toHaveProperty("callCount", 2);
  });
});
