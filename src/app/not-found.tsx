import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-[var(--primary)] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-[var(--gray-800)] mb-6">Trang không tìm thấy</h2>
      <p className="text-[var(--gray-500)] mb-8 max-w-md">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link 
        href="/" 
        className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-bold hover:bg-[var(--primary-dark)] transition-colors"
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
}
