import React, { useRef, useEffect } from "react";
import { select, scaleSqrt } from "d3";
import { useTheme } from "@material-ui/core/styles";
import "./graph.css";

function D3SizeBar(props) {
  const svgRef = useRef();

  const theme = useTheme();

  function fontSizeTitle(font) {
    if (font === 22) {
      return `10px`;
    }
    if (font === 28) {
      return `20px`;
    }
    if (font === 34) {
      return `25px`;
    }
  }

  function fontSizeTicks(font) {
    if (font === 10) {
      return `10px`;
    }
    if (font === 18) {
      return `14px`;
    }
    if (font === 24) {
      return `17.5px`;
    }
  }

  useEffect(() => {
    const sizeLegend = (selection, props) => {
      const { sizeScale, spacing, numTicks, circleFill, fontSize } = props;

      const ticks = sizeScale.ticks(numTicks).filter((d) => d !== 0);

      const groups = selection.selectAll("g").data(ticks);

      const groupsEnter = groups.enter().append("g");

      groupsEnter
        .merge(groups)
        .attr(`transform`, (d, i) => `translate(${i * spacing}, 0)`);

      groups.exit().remove();

      groupsEnter
        .append("circle")
        .merge(groups.select("circle"))
        .attr("r", sizeScale)
        .attr("fill", circleFill);

      groupsEnter
        .append("text")
        .merge(groups.select("text"))
        .text((d) => d)
        .attr("dy", "0.45em")
        .attr("x", (d) => sizeScale(d))
        .attr("transform", (d, i) => `translate(${-(spacing / 2) + i * 2}, 20)`)
        .style("fill", theme.palette.primary.main)
        .style("font-size", fontSize);
    };

    const data = [0, 0];
    data.splice(0, 1, Math.max.apply(Math, props.s));
    data.splice(1, 1, Math.min.apply(Math, props.s));

    const sizeScale = scaleSqrt().domain(data).range([12, 1]);

    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    svg
      .append("g")
      .attr("transform", `translate(30,40)`)
      .call(sizeLegend, {
        sizeScale,
        spacing: 50,
        numTicks: 6,
        circleFill: theme.palette.primary.main,
        fontSize: fontSizeTicks(props.font.axis),
      });
    svg
      .append("text")
      .attr("transform", `translate(10, 20)`)
      .text(props.saxis)
      .style("fill", theme.palette.text.primary)
      .style("font-size", fontSizeTitle(props.font.title));
  }, [props.s, props.saxis, props.font]);

  return <svg classname="D3SizeBar absolute bottom-0" width="25%" height="100%" ref={svgRef} />;
}

export default D3SizeBar;
