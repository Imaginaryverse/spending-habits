import SentimentVeryDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentVeryDissatisfiedOutlined";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import SentimentNeutralOutlinedIcon from "@mui/icons-material/SentimentNeutralOutlined";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

type SentimentType = "Very good" | "Good" | "Neutral" | "Bad" | "Very bad";

type SentimentIconProps = {
  percentage: number;
  sentimentParser: (percentage: number) => SentimentType;
  fontSize?: "inherit" | "small" | "medium" | "large";
};

export function SentimentIcon({
  percentage,
  sentimentParser,
  fontSize = "inherit",
}: SentimentIconProps) {
  const sentiment = sentimentParser(percentage);

  switch (sentiment) {
    case "Very good":
      return <SentimentVerySatisfiedIcon fontSize={fontSize} />;
    case "Good":
      return <SentimentSatisfiedAltIcon fontSize={fontSize} />;
    case "Neutral":
      return <SentimentNeutralOutlinedIcon fontSize={fontSize} />;
    case "Bad":
      return <SentimentDissatisfiedOutlinedIcon fontSize={fontSize} />;
    case "Very bad":
      return <SentimentVeryDissatisfiedOutlinedIcon fontSize={fontSize} />;
  }
}
