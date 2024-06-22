const express = require('express');
const router = express.Router();

router.get('/api/months', (req, res) => {
  const months = [
    { value: '01', name: 'มกราคม' },
    { value: '02', name: 'กุมภาพันธ์' },
    { value: '03', name: 'มีนาคม' },
    { value: '04', name: 'เมษายน' },
    { value: '05', name: 'พฤษภาคม' },
    { value: '06', name: 'มิถุนายน' },
    { value: '07', name: 'กรกฎาคม' },
    { value: '08', name: 'สิงหาคม' },
    { value: '09', name: 'กันยายน' },
    { value: '10', name: 'ตุลาคม' },
    { value: '11', name: 'พฤศจิกายน' },
    { value: '12', name: 'ธันวาคม' },
  ];
  res.json({ months });
});

router.get('/api/years', (req, res) => {
  const years = [
    { value: '2024', name: '2024' },
    { value: '2023', name: '2023' },
    { value: '2022', name: '2022' },
    { value: '2021', name: '2021' },
    { value: '2020', name: '2020' }
  ];
  res.json({ years });
});

module.exports = router;
