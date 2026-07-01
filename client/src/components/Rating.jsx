import { useMemo, useState } from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value] || ''}`;
}

export default function HoverRating({ value, onChange, reviewText, onReviewTextChange, defaultReview }) {
  const [hover, setHover] = useState(-1);
  const activeValue = useMemo(() => (value ?? 0), [value]);

  return (
    <div className="space-y-3">
      <Box sx={{ width: 220, display: 'flex', alignItems: 'center' }}>
        <Rating
          name="hover-feedback"
          value={activeValue}
          precision={0.5}
          getLabelText={getLabelText}
          onChange={(_, newValue) => onChange?.(newValue)}
          onChangeActive={(_, newHover) => setHover(newHover)}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        {activeValue > 0 && (
          <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : activeValue] || labels[activeValue]}</Box>
        )}
      </Box>

      <textarea
        value={reviewText ?? ''}
        onChange={(event) => onReviewTextChange?.(event.target.value)}
        placeholder="Write a short review"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        rows={3}
      />
      {!reviewText && defaultReview && (
        <p className="text-sm text-gray-500">Suggested review: {defaultReview}</p>
      )}
    </div>
  );
}
