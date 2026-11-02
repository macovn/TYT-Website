-- WO-WEB-08 PHAN B: chay tren Supabase SQL Editor NGAY SAU khi loader
-- nap xong chunks_wo_web_08.json (LUAT-114-2025, ND-165-2026 va 6 doan
-- ND-104-2016 giu lai kem ghi chu chuyen tiep).
-- Thu hoi quyen ghi cua anon, dua bang ve trang thai sau WO-WEB-07:
-- chi con service_role goi duoc add_bot_chunk.

REVOKE EXECUTE ON FUNCTION public.add_bot_chunk(text, text, text, text, int) FROM anon;

-- Kiem chung so doan theo tung van ban sau nap (so lieu ky vong ghi
-- trong harness/WO-WEB-08/checks.md).
SELECT doc_code, count(*) AS so_doan
FROM public.bot_chunks GROUP BY doc_code ORDER BY doc_code;

SELECT count(*) AS tong_so_doan FROM public.bot_chunks;

COMMIT;
