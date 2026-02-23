export default function LoadingOverlay({ visible, message }) {
  return (
    <div id="loadOverlay" className={visible ? 'on' : ''}>
      <div className="ov-spin" />
      <div className="ov-txt">অনুগ্রহ করে অপেক্ষা করুন</div>
      <div className="ov-sub">{message || 'তথ্য লোড হচ্ছে…'}</div>
    </div>
  );
}
