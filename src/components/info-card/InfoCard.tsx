import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card, Stack, Collapse, Typography, Button } from "@mui/material";
import { useState } from "react";

type InfoCardIcon = "info" | "help";

type InfoCardProps = {
  content: React.ReactNode;
  title?: string;
  icon?: InfoCardIcon;
  startOpen?: boolean;
};

export function InfoCard({
  content,
  title,
  icon = "info",
  startOpen = false,
}: InfoCardProps) {
  const [expanded, setExpanded] = useState(startOpen);

  const iconMap: Record<InfoCardIcon, React.ReactNode> = {
    info: <InfoOutlinedIcon sx={{ fontSize: "16px" }} />,
    help: <HelpOutlineIcon sx={{ fontSize: "16px" }} />,
  };

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <Button
        size="small"
        onClick={() => setExpanded(!expanded)}
        fullWidth
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 0,
          p: 1.5,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {iconMap[icon]}

          <Typography variant="body2" textTransform="none">
            {title}
          </Typography>
        </Stack>

        <ExpandMoreIcon
          fontSize="small"
          sx={{
            transform: expanded ? "rotate(180deg)" : undefined,
            transition: "transform 0.3s ease",
          }}
        />
      </Button>

      <Collapse in={expanded}>
        <Stack pt={1.5} pb={3} px={1.5}>
          {content}
        </Stack>
      </Collapse>
    </Card>
  );
}
