import SentimentVeryDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentVeryDissatisfiedOutlined";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import SentimentNeutralOutlinedIcon from "@mui/icons-material/SentimentNeutralOutlined";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

type SentimentIconProps = {
  percentage: number;
};

export function SentimentIcon({ percentage }: SentimentIconProps) {
  if (percentage >= 75) {
    return <SentimentVerySatisfiedIcon fontSize="inherit" />;
  }

  if (percentage >= 50) {
    return <SentimentSatisfiedAltIcon fontSize="inherit" />;
  }

  if (percentage >= 25) {
    return <SentimentNeutralOutlinedIcon fontSize="inherit" />;
  }

  if (percentage > 0) {
    return <SentimentDissatisfiedOutlinedIcon fontSize="inherit" />;
  }

  return <SentimentVeryDissatisfiedOutlinedIcon fontSize="inherit" />;
}
