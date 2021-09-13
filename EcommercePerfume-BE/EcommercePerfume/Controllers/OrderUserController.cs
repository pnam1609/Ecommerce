using PerfumeEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using WebApi.Jwt.Filters;

namespace EcommercePerfume.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class OrderUserController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();
        //[AllowAnonymous]
        //public IHttpActionResult Get()
        //{
        //    var phieudat = perfumeEntities.get_all_phieudat().ToList();
        //    if(phieudat == null)
        //    {
        //        return Ok(new
        //        {
        //            result = -1,
        //            message = "Không có đơn đặt hàng nào cả"
        //        });
        //    }
        //    return Ok(phieudat);
        //}

        [JwtAuthentication]
        public IHttpActionResult Get()
        {
            var phieudat = perfumeEntities.PHIEUDATs.Select(pd => new
            {
                pd.ID_PHIEUDAT,
                pd.HOTEN,
                pd.NGAYDAT,
                pd.NGAYGIAO,
                pd.SODIENTHOAI,
                pd.DIACHI,
                pd.TRANGTHAI,
                pd.TRANSACTIONID,
                pd.GHICHU,
                CT_PD = pd.CT_PHIEUDAT.Select(ctpd => new
                {
                    ctpd.SanPham.DONGSANPHAM.TEN,
                    ctpd.SanPham.DUNGTICH,
                    ctpd.GIA,
                    ctpd.SOLUONG
                }),
                TONGTIEN = pd.CT_PHIEUDAT.Sum(x => x.GIA) == null ? 0 : pd.CT_PHIEUDAT.Sum(x => x.GIA)
            }).OrderByDescending(x => x.NGAYDAT);
            if (phieudat == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có đơn đặt hàng nào cả"
                });
            }
            return Ok(phieudat);


        }
        

        [JwtAuthentication]
        public IHttpActionResult Get(String MA_KH,int TRANGTHAI)
        {
            //var listOrderUser_Status = perfumeEntities.get_order_follow_user_by_status(MA_KH, TRANGTHAI).ToList();

            var listOrderUser_Status = perfumeEntities.PHIEUDATs.Where(x => x.TRANGTHAI == TRANGTHAI && x.MA_KH == MA_KH)
                .Select(pd => new
                {
                    pd.ID_PHIEUDAT,
                    pd.HOTEN,
                    pd.NGAYDAT,
                    pd.NGAYGIAO,
                    pd.SODIENTHOAI,
                    pd.DIACHI,
                    pd.TRANGTHAI,
                    pd.TRANSACTIONID,
                    pd.GHICHU,
                    CT_PD = pd.CT_PHIEUDAT.Select(ctpd => new
                    {
                        ctpd.SanPham.DONGSANPHAM.TEN,
                        ctpd.SanPham.DUNGTICH,
                        ctpd.GIA,
                        ctpd.SOLUONG
                    }),
                    TONGTIEN = pd.CT_PHIEUDAT.Sum(x=> x.GIA) == null ? 0: pd.CT_PHIEUDAT.Sum(x => x.GIA)

                }).OrderByDescending(x => x.NGAYDAT);
            if (listOrderUser_Status == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Đơn đặt hàng trống"
                });
            }
            return Ok(listOrderUser_Status);
        }

        //[JwtAuthentication]
        //public IHttpActionResult Get(string TRANGTHAI)
        //{
        //    int TRANGTHAI1 = int.Parse(TRANGTHAI);
        //    var listOrderUser_Status = perfumeEntities.get_order_by_status(TRANGTHAI1).ToList();
        //    if (listOrderUser_Status == null)
        //    {
        //        return Ok(new
        //        {
        //            result = -1,
        //            message = "Đơn đặt hàng trống"
        //        });
        //    }
        //    return Ok(listOrderUser_Status);
        //}

        [JwtAuthentication]
        public IHttpActionResult Get(string TRANGTHAI)
        {
            int TRANGTHAI1 = int.Parse(TRANGTHAI);
            var listOrderUser_Status = perfumeEntities.PHIEUDATs.Where(x => x.TRANGTHAI == TRANGTHAI1)
                .Select(pd => new
                {
                    pd.ID_PHIEUDAT,
                    pd.HOTEN,
                    pd.NGAYDAT,
                    pd.NGAYGIAO,
                    pd.SODIENTHOAI,
                    pd.DIACHI,
                    pd.TRANGTHAI,
                    pd.TRANSACTIONID,
                    pd.GHICHU,
                    CT_PD = pd.CT_PHIEUDAT.Select(ctpd => new
                    {
                        ctpd.ID_CTPD,
                        ctpd.MA_SP,
                        ctpd.ID_PHIEUDAT,
                        ctpd.SanPham.DONGSANPHAM.TEN,
                        ctpd.SanPham.DUNGTICH,
                        ctpd.GIA,
                        ctpd.SOLUONG
                    }),
                    TONGTIEN = pd.CT_PHIEUDAT.Sum(x => x.GIA) == null ? 0 : pd.CT_PHIEUDAT.Sum(x => x.GIA)

                }).OrderByDescending(x=>x.NGAYDAT)
                .ToList();
            if (listOrderUser_Status == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Đơn đặt hàng trống"
                });
            }
            return Ok(listOrderUser_Status);
        }


        [AllowAnonymous]
        public IHttpActionResult Get(int id)
        {
            var pd = perfumeEntities.PHIEUDATs.Find(id);
            var res = new
            {
                pd.MA_NV,
                pd.HOTEN,
                pd.DIACHI,
                pd.SODIENTHOAI,
                pd.NGAYDAT,
                pd.NGAYGIAO,
                pd.TRANGTHAI,
                pd.MA_KH,
                pd.TRANSACTIONID,
                pd.GHICHU,
                pd.ID_PHIEUDAT,
                CT_PHIEUDAT = pd.CT_PHIEUDAT.Select(CT_PD => new
                {
                    CT_PD.ID_PHIEUDAT,
                    CT_PD.MA_SP,
                    CT_PD.SOLUONG,
                    CT_PD.GIA
                })
            };
            return Ok(res);
        }

        [JwtAuthentication]
        public IHttpActionResult Post([FromBody] PHIEUDAT pd)
        {
            if(pd == null || pd.SODIENTHOAI.Trim() == "" || pd.HOTEN.Trim() == "" )
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trống"
                });
            }
            var user = perfumeEntities.KHACHHANGs.Find(pd.MA_KH);
            if(user == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Khách hàng không tồn tại"
                });
            }
            if(pd.CT_PHIEUDAT.Count == 0)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Không có sản phẩm này trong phiếu đặt"
                });
            }

            perfumeEntities.PHIEUDATs.Add(pd);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Đặt hàng thành công"
            });
        }
        [JwtAuthentication]
        public IHttpActionResult Put([FromBody] PHIEUDAT pd,bool isUpdateStatus)
        {
            var phieuDat = perfumeEntities.PHIEUDATs.Find(pd.ID_PHIEUDAT);
            if (phieuDat == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không tìm thấy mã phiếu đặt"
                });
            }
            if (isUpdateStatus)
            {
                phieuDat.TRANGTHAI = pd.TRANGTHAI;
                phieuDat.MA_NV = pd.MA_NV;
                //khi trạng thái chuyển sang hủy thì cần trả lại số lượng tồn
                if (pd.TRANGTHAI.Equals(3))
                {
                    //var phieud = perfumeEntities.CT_PHIEUDAT.Where(ct => ct.ID_PHIEUDAT == pd.ID_PHIEUDAT);

                    foreach (var ele in pd.CT_PHIEUDAT)
                    {
                        var sp = perfumeEntities.SanPhams.Find(ele.MA_SP);
                        sp.SOLUONGTON += ele.SOLUONG;
                    }
                }
                perfumeEntities.SaveChanges();
                return Ok(new
                {
                    result = 1,
                    message = "Sửa trạng thái của phiếu đặt thành công"
                });
            }
            else
            {
                phieuDat.NGAYGIAO = pd.NGAYGIAO;
                phieuDat.MA_NV = pd.MA_NV;
                perfumeEntities.SaveChanges();
                return Ok(new
                {
                    result = 1,
                    message = "Sửa ngày giao thành công"
                });
            }
            

            
        }
    }
}