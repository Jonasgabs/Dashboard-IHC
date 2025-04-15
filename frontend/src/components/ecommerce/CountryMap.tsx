// react plugin for creating vector maps
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";

// Define the component props
interface CountryMapProps {
  mapColor?: string;
}

const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"
      markerStyle={{
        initial: {
          fill: "var(--color-brand-yellow)",
          r: 4, 
        } as any, 
      }}
      markersSelectable={true}
      markers={[
        {
          latLng: [37.2580397, -104.657039],
          name: "United States",
          style: {
            fill: "var(--color-brand-yellow)",
            borderWidth: 1,
            borderColor: "white",
            stroke: "var(--color-brand-yellow)",
          },
        },
        {
          latLng: [20.7504374, 73.7276105],
          name: "India",
          style: { fill: "var(--color-brand-yellow)", borderWidth: 1, borderColor: "white" },
        },
        {
          latLng: [53.613, -11.6368],
          name: "United Kingdom",
          style: { fill: "var(--color-brand-yellow)", borderWidth: 1, borderColor: "white" },
        },
        {
          latLng: [-25.0304388, 115.2092761],
          name: "Sweden",
          style: {
            fill: "var(--color-brand-yellow)",
            borderWidth: 1,
            borderColor: "white",
            strokeOpacity: 0,
          },
        },
      ]}
      zoomOnScroll={false}
      zoomMax={12}
      zoomMin={1}
      zoomAnimate={true}
      zoomStep={1.5}
      regionStyle={{
        initial: {
          fill: mapColor || "var(--color-brand-yellow)",
          fillOpacity: 1,
          fontFamily: "Outfit",
          stroke: "none",
          strokeWidth: 0,
          strokeOpacity: 0,
        },
        hover: {
          fillOpacity: 0.7,
          cursor: "pointer",
          fill: "var(--color-brand-yellow)",
          stroke: "none",
        },
        selected: {
          fill: "var(--color-brand-yellow)",
        },
        selectedHover: {},
      }}
      regionLabelStyle={{
        initial: {
          fill: "var(--color-brand-yellow)",
          fontWeight: 500,
          fontSize: "13px",
          stroke: "none",
        },
        hover: {},
        selected: {},
        selectedHover: {},
      }}
    />
  );
};

export default CountryMap;
