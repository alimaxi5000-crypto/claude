#include "test_framework.h"

#include <jays/log.h>

#include <cstring>

int main(int argc, char** argv)
{
	const char* filter = argc > 1 ? argv[1] : nullptr;
	jays::log::SetQuiet(std::getenv("JAYS_TEST_VERBOSE") == nullptr);

	int passed = 0, failed = 0;
	for (auto& t : jt::Registry())
	{
		if (filter && !std::strstr(t.name, filter))
		{
			continue;
		}
		try
		{
			t.fn();
			passed++;
			std::cout << "[PASS] " << t.name << "\n";
		}
		catch (const jt::Failure& f)
		{
			failed++;
			std::cout << "[FAIL] " << t.name << "\n       " << f.message << "\n";
		}
		catch (const std::exception& e)
		{
			failed++;
			std::cout << "[FAIL] " << t.name << "\n       exception: " << e.what() << "\n";
		}
	}

	std::cout << "\n" << passed << " passed, " << failed << " failed, " << jt::CheckCount() << " checks\n";
	return failed == 0 ? 0 : 1;
}
