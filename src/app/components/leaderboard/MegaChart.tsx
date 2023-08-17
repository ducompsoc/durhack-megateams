import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import annotationPlugin, { AnnotationOptions } from "chartjs-plugin-annotation";
import { Options } from "chartjs-plugin-datalabels/types/options";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels,
  annotationPlugin
);

export default function MegaChart() {
  const megateams = [
    { id: 1, points: 450, name: "Team 1", image: new Image() },
    { id: 2, points: 500, name: "Team 2", image: new Image() },
    { id: 3, points: 400, name: "Team 3", image: new Image() },
    { id: 4, points: 200, name: "Team 4", image: new Image() },
  ];

  for (let team of megateams) {
    team.image.src = `/${team.id}.png`;
  }

  const dataset = {
    labels: megateams.map((team) => team.name),
    datasets: [
      {
        label: "Points",
        data: megateams.map((team) => team.points),
      },
    ],
  };

  const datalabels: Options = { anchor: "start", align: "end" };

  const options = {
    scales: { y: { display: false }, x: { grid: { display: false } } },
    plugins: {
      datalabels,
      annotation: {
        annotations: megateams.map((team, i) => {
          const options: AnnotationOptions = {
            type: "box",
            yMin: Math.max(team.points - 100, 250),
            yMax: Math.max(team.points - 100, 250),
            xMax: i,
            xMin: i,
            label: {
              display: true,
              content: team.image,
              width: 50,
              height: 50,
              position: "center",
            },
          };
          return options;
        }),
      },
    },
  };

  return <Bar data={dataset} options={options} />;
}
