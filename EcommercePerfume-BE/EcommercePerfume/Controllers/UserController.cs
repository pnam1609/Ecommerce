using PerfumeEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using WebApi.Jwt;
using WebApi.Jwt.Filters;

namespace EcommercePerfume.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UserController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();

        [JwtAuthentication]
        public IHttpActionResult Get()
        {
            var users = perfumeEntities.KHACHHANGs.Select(user => new
            {
                user.MA_KH,
                user.HOTEN,
                user.NGAYSINH,
                user.PASS,
                user.SODIENTHOAI,
                user.DIACHI,
                user.EMAIL
            }).ToList();
            if(users.Count == 0)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không tìm có người dùng"
                });
            }
            return Ok(users);
        }

        [AllowAnonymous]
        public IHttpActionResult Get(string username, string password)
        {
            var users = perfumeEntities.get_all_user().ToList();
            var user = users.Where(nv => nv.EMAIL == username && nv.PASS == password).FirstOrDefault();
            if(user == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Sai tài khoản đăng nhập hoặc mật khẩu"
                });
            }

            //================================================
            var user1 = new KHACHHANG();
            user1.MA_KH = user.MA_KH;
            user1.EMAIL = user.EMAIL;
            user1.HOTEN = user.HOTEN;
            user1.DIACHI = user.DIACHI;
            user1.SODIENTHOAI = user.SODIENTHOAI;

            //================================================
            if (user != null && user.PASS == password)
            {
                var res = new
                {
                    result = 1,
                    role = "KHACHHANG",
                    token = JwtManager.GenerateTokenUser(user1)
                };
                return Ok(res);
            }
            //throw new HttpResponseException(HttpStatusCode.Unauthorized);
            return Ok(new
            {
                result = -1,
                message = "Sai tài khoản đăng nhập hoặc mật khẩu"
            });
        }

        [AllowAnonymous]
        public IHttpActionResult Get(String id)
        {
            var user = perfumeEntities.KHACHHANGs.Find(id);
            if(user == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Khách hàng này không tồn tai"
                });
            }
            var res = new
            {
                user.MA_KH,
                user.HOTEN,
                user.NGAYSINH,
                user.PASS,
                user.SODIENTHOAI,
                user.DIACHI,
                user.EMAIL
            };

            return Ok(res);
        }

        [AllowAnonymous]
        public IHttpActionResult Post([FromBody] KHACHHANG kh)
        {
            if (kh == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trốn hoặc thiếu"
                });
            }
            var checkNV = perfumeEntities.KHACHHANGs.Find(kh.MA_KH);
            if (checkNV != null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Chứng minh thư này đã được tạo tài khoản"
                });
            }
            var checkEmail = perfumeEntities.KHACHHANGs.Where(x => x.EMAIL == kh.EMAIL).ToList();
            if (checkEmail.Count >= 1)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Email đã có người sử dụng"
                });
            }

            perfumeEntities.KHACHHANGs.Add(kh);
            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Tạo tài khoản thành công"
            });
        }

        [JwtAuthentication]
        public IHttpActionResult Put([FromBody] KHACHHANG kh)
        {
            //validate them
            if (kh == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trống"
                });
            }

            var khachhang = perfumeEntities.KHACHHANGs.Find(kh.MA_KH);
            if(khachhang == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Người dùng không tồn tại"
                });
            }
            khachhang.HOTEN = kh.HOTEN;
            khachhang.EMAIL = kh.EMAIL;
            khachhang.SODIENTHOAI = kh.SODIENTHOAI;
            khachhang.NGAYSINH = kh.NGAYSINH;
            khachhang.DIACHI = kh.DIACHI;
            khachhang.PASS = kh.PASS;

            perfumeEntities.SaveChanges();

            return Ok(new
            {
                result = 1,
                message = "Sửa thông tin khách hàng thành công"
            });
        }
    }
}