import SentimentVeryDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentVeryDissatisfiedOutlined";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import SentimentNeutralOutlinedIcon from "@mui/icons-material/SentimentNeutralOutlined";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

type SentimentIconProps = {
  percentage: number;
};

export function SentimentIcon({ percentage }: SentimentIconProps) {
  if (percentage > 100) {
    return <SentimentVeryDissatisfiedOutlinedIcon fontSize="small" />;
  }

  if (percentage >= 75) {
    return <SentimentDissatisfiedOutlinedIcon fontSize="small" />;
  }

  if (percentage >= 50) {
    return <SentimentNeutralOutlinedIcon fontSize="small" />;
  }

  if (percentage >= 25) {
    return <SentimentSatisfiedAltIcon fontSize="small" />;
  }

  return <SentimentVerySatisfiedIcon fontSize="small" />;
}
