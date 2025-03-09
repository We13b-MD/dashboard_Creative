const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./connectDB')
const mongoose = require('mongoose')
require('dotenv').config()
app.use(cors())
app.use(express.json())

connectDB()

const { Schema, model } = mongoose;
const dailyMetricSchema = new Schema({
  date: { type: Date, default: Date.now },
  imp: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  ctr: { type: Number, default: 0 },
  reach: { type: Number, default: 0 },
  spend: { type: Number, default: 0 },
  viewableImpressions: { type: Number, default: 0 },
  engagementRate: { type: Number, default: 0 },
  videoStart: { type: Number, default: 0 },
  firstQuartile: { type: Number, default: 0 },
  midpoint: { type: Number, default: 0 },
  thirdQuartile: { type: Number, default: 0 },
  completion: { type: Number, default: 0 },
  pause: { type: Number, default: 0 },
  unmute: { type: Number, default: 0 },
 
});

// Create the model
const DailyMetric = model('DailyMetric', dailyMetricSchema);

app.get('/data-by-date', async (req, res) => {
  try {
      // Fetch all records, sorted by date
      const data = await DailyMetric.find().sort({ date: 1 });

      if (data.length === 0) {
          return res.status(404).json({ message: 'No data found' });
      }
      const formattedData = data.map(item => ({
        ...item._doc,
        date: item.date.toISOString().split('T')[0]
    }));

      res.json(formattedData);
  } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/aggregate-data', async (req, res) => {
try {
    const aggregatedData = await DailyMetric.aggregate([
        {
            $group: {
                _id: null, 
                totalImp: { $sum: "$imp" },
                totalClicks: { $sum: "$clicks" },
                totalFirstQuartile: { $sum: "$firstQuartile" },
                totalMidpoint: { $sum: "$midpoint" },
                totalThirdQuartile: { $sum: "$thirdQuartile" },
                totalVideoStart: { $sum: "$videoStart" },
                totalPause: { $sum: "$pause" },
                totalUnmute: { $sum: "$unmute" },
                totalCompleted: { $sum: "$completed" },
                totalViewableImpressions: { $sum: "$viewableImpressions" },
                totalReach: { $sum: "$reach" },
                totalCTR: { 
                    $sum: { 
                        $cond: { 
                            if: { $gt: ["$imp", 0] }, 
                            then: { $divide: ["$clicks", "$imp"] }, 
                            else: 0 
                        }
                    }
                }
            }
        }
    ]);

    if (aggregatedData.length === 0) {
        return res.status(404).json({ message: 'No data found' });
    }
  

  

    res.json(aggregatedData[0]);
  

} catch (err) {
    console.error('Error aggregating data:', err);
    res.status(500).send('Internal Server Error');
}
});



// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
