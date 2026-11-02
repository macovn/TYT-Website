-- WO-WEB-08 PHAN A: chay tren Supabase SQL Editor TRUOC khi chay loader.
-- 1) Go doan cua van ban da het hieu luc khoi bot_chunks.
--    ND-104-2016 xoa toan bo: 6 doan Dieu 9, 10, 11 duoc nap lai qua
--    rpc add_bot_chunk kem ghi chu chuyen tiep (khoan 5 Dieu 94
--    ND 165/2026/ND-CP, con hieu luc den het 30/6/2027).
-- Sao luu truoc khi chay: ~/workspace/backups/bot-chunks-backup-20261102-wo-web-08.json
-- (321 doan, dem khop tung van ban voi trang thai WO-WEB-07).

DELETE FROM public.bot_chunks WHERE doc_code IN ('LUAT-03-2007', 'ND-13-2024');
DELETE FROM public.bot_chunks WHERE doc_code = 'ND-104-2016';

-- 2) Tam cap quyen nap cho anon (thu hoi ngay o dot4b sau khi nap xong).
GRANT EXECUTE ON FUNCTION public.add_bot_chunk(text, text, text, text, int) TO anon;

-- Kiem chung sau Phan A: chi con 5 van ban, tong 204 doan.
SELECT doc_code, count(*) AS so_doan
FROM public.bot_chunks GROUP BY doc_code ORDER BY doc_code;

COMMIT;
